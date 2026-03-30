package com.wordcloud.core.service;

import com.wordcloud.core.dto.SubmissionResponseDto;
import com.wordcloud.core.dto.SubmissionSummaryDto;
import com.wordcloud.core.dto.WordCountDto;
import com.wordcloud.core.entity.Submission;
import com.wordcloud.core.entity.SubmissionStatus;
import com.wordcloud.core.messaging.ChunkPublisher;
import com.wordcloud.core.repository.SubmissionRepository;
import com.wordcloud.core.repository.WordCountRepository;
import jakarta.annotation.Nonnull;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final WordCountRepository wordCountRepository;
    private final ChunkPublisher chunkPublisher;

    private final String DEFAULT_FILE_NAME = "default_file.txt";

    @Value("${wordcloud.chunk-size-bytes}")
    private int chunkSizeBytes;

    public SubmissionResponseDto submitFile(MultipartFile file) throws IOException {
        // Since we have a 100MB limitation I did not use Streams here.
        // For smaller files loading the bytes directly is "easier" in the context of this task.
        byte[] fileBytes = file.getBytes();
        List<String> chunks = splitIntoChunks(fileBytes, chunkSizeBytes);

        Submission submission = initializeFileSubmission(file, chunks);

        UUID submissionId = submission.getId();
        publishChunkMessage(chunks, submissionId);

        return SubmissionResponseDto.builder()
                .id(submissionId)
                .status(SubmissionStatus.PENDING)
                .wordCounts(List.of())
                .build();
    }

    private List<String> splitIntoChunks(byte[] totalFileBytes, int chunkSize) {
        List<String> chunks = new ArrayList<>();

        if (totalFileBytes.length == 0) {
            chunks.add("");
            return chunks;
        }

        int chunkStart = 0;
        while (chunkStart < totalFileBytes.length) {
            int end = Math.min(chunkStart + chunkSize, totalFileBytes.length);
            if (end < totalFileBytes.length) {
                int boundary = end;
                while (boundary > chunkStart && totalFileBytes[boundary] != ' ' && totalFileBytes[boundary] != '\n') {
                    boundary--;
                }
                if (boundary > chunkStart) {
                    end = boundary;
                }
            }
            chunks.add(new String(totalFileBytes, chunkStart, end - chunkStart, StandardCharsets.UTF_8));
            chunkStart = end;
        }
        return chunks;
    }

    @Nonnull
    private Submission initializeFileSubmission(MultipartFile file, List<String> chunks) {
        Submission submission = new Submission();
        submission.setFilename(file.getOriginalFilename() != null ? file.getOriginalFilename() : DEFAULT_FILE_NAME);
        submission.setStatus(SubmissionStatus.PENDING);
        submission.setTotalChunks(chunks.size());
        submission.setFileSizeBytes(file.getSize());
        submission = submissionRepository.save(submission);
        return submission;
    }

    private void publishChunkMessage(List<String> chunks, UUID submissionId) {
        int totalChunks = chunks.size();
        for (int chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            chunkPublisher.publish(submissionId, chunkIndex, totalChunks, chunks.get(chunkIndex));
        }
    }

    public SubmissionResponseDto getSubmission(UUID id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found: " + id));

        List<WordCountDto> wordCounts = wordCountRepository.findBySubmissionIdOrderByCountDesc(id)
                .stream()
                .map(wc -> WordCountDto.builder()
                        .word(wc.getWord())
                        .count(wc.getCount())
                        .build())
                .toList();

        return SubmissionResponseDto.builder()
                .id(submission.getId())
                .status(submission.getStatus())
                .wordCounts(wordCounts)
                .build();
    }

    public List<SubmissionSummaryDto> listSubmissions() {
        return submissionRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(submission -> {
                    List<WordCountDto> topWords = wordCountRepository
                            .findBySubmissionIdOrderByCountDesc(submission.getId())
                            .stream()
                            .limit(3)
                            .map(wc -> WordCountDto.builder()
                                    .word(wc.getWord())
                                    .count(wc.getCount())
                                    .build())
                            .toList();
                    return SubmissionSummaryDto.builder()
                            .id(submission.getId())
                            .filename(submission.getFilename())
                            .status(submission.getStatus())
                            .fileSizeBytes(submission.getFileSizeBytes())
                            .createdAt(submission.getCreatedAt())
                            .topWords(topWords)
                            .build();
                })
                .toList();
    }
}
