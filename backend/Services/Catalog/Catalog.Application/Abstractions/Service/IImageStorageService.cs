namespace Catalog.Application.Abstractions.Service;

public interface IImageStorageService
{
    Task<string> UploadImageAsync(string key, Stream imageStream, string contentType, CancellationToken cancellationToken = default);
    Task DeleteImageAsync(string key, CancellationToken cancellationToken = default);
}
