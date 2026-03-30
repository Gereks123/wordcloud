package com.wordcloud.core.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WordCountDto {
    private String word;
    private int count;
}
