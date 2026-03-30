package com.wordcloud.worker.service;

import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class StopWordFilter {

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
            "of", "for", "is", "it", "as", "be", "by", "was", "are", "with",
            "that", "this", "from", "i", "you", "he", "she", "we", "they",
            "his", "her", "its", "our", "their", "my", "your", "have", "has",
            "had", "do", "does", "did", "will", "would", "could", "should",
            "may", "might", "not", "no", "so", "if", "then", "than", "when",
            "where", "who", "which", "what", "how", "all", "each", "been",
            "were", "can", "am", "up", "out", "about", "into", "also", "s"
    );

    public boolean isStopWord(String word) {
        return STOP_WORDS.contains(word.toLowerCase());
    }
}
