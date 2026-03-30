package com.wordcloud.core.repository;

import com.wordcloud.core.entity.WordCount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WordCountRepository extends JpaRepository<WordCount, Long> {

    List<WordCount> findBySubmissionIdOrderByCountDesc(UUID submissionId);
}
