package com.wordcloud.worker.listener;

import com.wordcloud.worker.messaging.ChunkMessage;
import com.wordcloud.worker.service.WordProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChunkListener {

    private final WordProcessingService wordProcessingService;

    @RabbitListener(queues = "${wordcloud.rabbitmq.queue}")
    public void handleChunk(ChunkMessage message) {
        log.info("Received chunk {}/{} for submission {}",
                message.getChunkIndex() + 1, message.getTotalChunks(), message.getSubmissionId());
        wordProcessingService.processChunk(
                message.getSubmissionId(),
                message.getChunkIndex(),
                message.getTotalChunks(),
                message.getText()
        );
    }
}
