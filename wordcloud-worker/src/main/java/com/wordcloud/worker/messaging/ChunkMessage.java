package com.wordcloud.worker.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChunkMessage {
    private UUID submissionId;
    private int chunkIndex;
    private int totalChunks;
    private String text;
}
