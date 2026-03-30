package com.wordcloud.core.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ChunkPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${wordcloud.rabbitmq.exchange}")
    private String exchange;

    @Value("${wordcloud.rabbitmq.routing-key}")
    private String routingKey;

    public void publish(UUID submissionId, int chunkIndex, int totalChunks, String text) {
        ChunkMessage message = ChunkMessage.builder()
                .submissionId(submissionId)
                .chunkIndex(chunkIndex)
                .totalChunks(totalChunks)
                .text(text)
                .build();
        rabbitTemplate.convertAndSend(exchange, routingKey, message);
    }
}
