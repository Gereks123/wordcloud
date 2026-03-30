package com.wordcloud.worker.service;

import com.wordcloud.worker.entity.SubmissionStatus;
import com.wordcloud.worker.repository.SubmissionRepository;
import com.wordcloud.worker.repository.WordCountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WordProcessingService {

    private final SubmissionRepository submissionRepository;
    private final WordCountRepository wordCountRepository;
    private final StopWordFilter stopWordFilter;

    private final ConcurrentHashMap<UUID, AtomicInteger> chunkCounters = new ConcurrentHashMap<>();

    @Transactional
    public void processChunk(UUID submissionId, int chunkIndex, int totalChunks, String text) {
        log.info("Processing chunk {}/{} for submission {}", chunkIndex + 1, totalChunks, submissionId);

        if (chunkIndex == 0) {
            submissionRepository.updateStatus(submissionId, SubmissionStatus.IN_PROGRESS);
        }

        Map<String, Integer> wordCounts = tokenizeAndCount(text);
        wordCounts.forEach((word, count) ->
                wordCountRepository.upsertWordCount(submissionId, word, count));

        chunkCounters.computeIfAbsent(submissionId, id -> new AtomicInteger(0));
        int processed = chunkCounters.get(submissionId).incrementAndGet();

        if (processed >= totalChunks) {
            finalizeSubmission(submissionId);
            chunkCounters.remove(submissionId);
        }
    }

    @Transactional
    public void finalizeSubmission(UUID submissionId) {
        log.info("Finalizing submission {}: removing outliers", submissionId);
        wordCountRepository.deleteOutliers(submissionId);
        submissionRepository.updateStatus(submissionId, SubmissionStatus.COMPLETE);
        log.info("Submission {} marked COMPLETE", submissionId);
    }

    private Map<String, Integer> tokenizeAndCount(String text) {
        String cleanedText = text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ");
        return Arrays.stream(cleanedText.split("\\s+"))
                .filter(word -> word.length() > 1)
                .filter(word -> !stopWordFilter.isStopWord(word))
                .collect(Collectors.groupingBy(Function.identity(), Collectors.summingInt(w -> 1)));
    }
}
