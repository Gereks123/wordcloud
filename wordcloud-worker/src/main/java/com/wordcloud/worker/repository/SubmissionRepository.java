package com.wordcloud.worker.repository;

import com.wordcloud.worker.entity.Submission;
import com.wordcloud.worker.entity.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    @Modifying
    @Query("UPDATE Submission s SET s.status = :status WHERE s.id = :id")
    int updateStatus(@Param("id") UUID id, @Param("status") SubmissionStatus status);
}
