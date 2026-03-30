package com.wordcloud.core.dto;

import com.wordcloud.core.entity.SubmissionStatus;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class SubmissionSummaryDto {
    private UUID id;
    private String filename;
    private SubmissionStatus status;
    private Long fileSizeBytes;
    private OffsetDateTime createdAt;
    private List<WordCountDto> topWords;
}
