package com.programming.courseservice.repository;

import com.main.progamming.common.controller.BaseApiImpl;
import com.main.progamming.common.repository.BaseRepository;
import com.programming.courseservice.domain.dto.CourseDto;
import com.programming.courseservice.domain.persistent.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CourseRepository extends BaseRepository<Course> {
    @Query("select c from Course c where c.topic.id = :topicId")
    List<Course> getCourseByTopicId(@Param("topicId") String topicId, Pageable pageable);

    @Modifying
    @Query(value = "update course set language_id=:languageId, topic_id=:topicId, level_id=:levelId where id=:id"
            , nativeQuery = true)
    @Transactional
    void updateCourse(String id, String levelId, String topicId, String languageId);

    @Query("""
                Select ca.course from CourseAccess ca where ca.course.topic.id = :topicId 
                GROUP BY ca.course.id 
                order by count(ca.course.id) DESC
           """)
    List<Course> findPopularCourses(@Param("topicId") String topicId, Pageable pageable);
}
