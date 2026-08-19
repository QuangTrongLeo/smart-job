package be_smart_job.dto.res;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private int status;
    private String msg;
    private T data;

    // Phương thức duy nhất nhận đủ int status, String msg, T data
    public static <T> ApiResponse<T> of(int status, String msg, T data) {
        return new ApiResponse<>(status, msg, data);
    }
}
