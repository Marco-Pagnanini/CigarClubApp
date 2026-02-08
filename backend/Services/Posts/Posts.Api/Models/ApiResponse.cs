namespace Posts.Api.Models;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public Dictionary<string, string[]>? Errors { get; set; }

    public static ApiResponse<T> SuccessResponse(T data, string message = "Operation completed successfully")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse<T> ErrorResponse(string message, Dictionary<string, string[]>? errors = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
}

public class ApiResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public Dictionary<string, string[]>? Errors { get; set; }

    public static ApiResponse SuccessResponse(string message = "Operation completed successfully")
    {
        return new ApiResponse
        {
            Success = true,
            Message = message
        };
    }

    public static ApiResponse ErrorResponse(string message, Dictionary<string, string[]>? errors = null)
    {
        return new ApiResponse
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
}
