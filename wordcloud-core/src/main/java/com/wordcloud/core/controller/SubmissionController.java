package com.wordcloud.core.controller;

import com.wordcloud.core.dto.SubmissionResponseDto;
import com.wordcloud.core.dto.SubmissionSummaryDto;
import com.wordcloud.core.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping
    public ResponseEntity<List<SubmissionSummaryDto>> listSubmissions() {
        return ResponseEntity.ok(submissionService.listSubmissions());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SubmissionResponseDto> submit(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.accepted().body(submissionService.submitFile(file));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponseDto> getSubmission(@PathVariable UUID id) {
        return ResponseEntity.ok(submissionService.getSubmission(id));
    }
}
