package com.programming.courseservice.core.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    @NotEmpty(message = "CategoryId is required")
    private String id;
    @NotEmpty(message = "CategoryName is required")
    private String name;
    private String description;
    private Set<TopicDto> topics;
}
