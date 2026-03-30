package com.wordcloud.worker.repository;

import com.wordcloud.worker.entity.WordCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface WordCountRepository extends JpaRepository<WordCount, Long> {

    @Modifying
    @Query(value = """
            INSERT INTO word_counts (submission_id, word, count)
            VALUES (:submissionId, :word, :count)
            ON CONFLICT (submission_id, word)
            DO UPDATE SET count = word_counts.count + EXCLUDED.count
            """, nativeQuery = true)
    void upsertWordCount(@Param("submissionId") UUID submissionId,
                         @Param("word") String word,
                         @Param("count") int count);

    @Modifying
    @Query(value = "DELETE FROM word_counts WHERE submission_id = :submissionId AND count < 2",
            nativeQuery = true)
    void deleteOutliers(@Param("submissionId") UUID submissionId);
}
