package com.wordcloud.core.dto;

import com.wordcloud.core.entity.SubmissionStatus;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class SubmissionResponseDto {
    private UUID id;
    private SubmissionStatus status;
    private List<WordCountDto> wordCounts;
}
