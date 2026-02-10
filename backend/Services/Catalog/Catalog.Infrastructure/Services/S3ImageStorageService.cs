using Amazon.S3;
using Amazon.S3.Model;
using Catalog.Application.Abstractions.Service;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Catalog.Infrastructure.Services;

public class S3ImageStorageService : IImageStorageService
{
    private readonly AmazonS3Client _s3Client;
    private readonly string _bucketName;
    private readonly string _publicUrl;
    private readonly ILogger<S3ImageStorageService> _logger;
    private bool _bucketEnsured;

    public S3ImageStorageService(IConfiguration configuration, ILogger<S3ImageStorageService> logger)
    {
        _logger = logger;

        var serviceUrl = configuration["S3:ServiceUrl"]!;
        var accessKey = configuration["S3:AccessKey"]!;
        var secretKey = configuration["S3:SecretKey"]!;
        _bucketName = configuration["S3:BucketName"] ?? "cigar-images";
        _publicUrl = configuration["S3:PublicUrl"]!;
        var forcePathStyle = string.Equals(configuration["S3:ForcePathStyle"], "true", StringComparison.OrdinalIgnoreCase);

        var config = new AmazonS3Config
        {
            ServiceURL = serviceUrl,
            ForcePathStyle = forcePathStyle
        };

        _s3Client = new AmazonS3Client(accessKey, secretKey, config);
    }

    public async Task<string> UploadImageAsync(string key, Stream imageStream, string contentType, CancellationToken cancellationToken = default)
    {
        await EnsureBucketExistsAsync(cancellationToken);

        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = key,
            InputStream = imageStream,
            ContentType = contentType
        };

        await _s3Client.PutObjectAsync(request, cancellationToken);
        _logger.LogInformation("Uploaded image with key {Key} to bucket {Bucket}", key, _bucketName);

        return $"{_publicUrl}/{key}";
    }

    public async Task DeleteImageAsync(string key, CancellationToken cancellationToken = default)
    {
        var request = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = key
        };

        await _s3Client.DeleteObjectAsync(request, cancellationToken);
        _logger.LogInformation("Deleted image with key {Key} from bucket {Bucket}", key, _bucketName);
    }

    private async Task EnsureBucketExistsAsync(CancellationToken cancellationToken)
    {
        if (_bucketEnsured) return;

        try
        {
            await _s3Client.GetBucketLocationAsync(new GetBucketLocationRequest
            {
                BucketName = _bucketName
            }, cancellationToken);
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            _logger.LogInformation("Bucket {Bucket} not found, creating...", _bucketName);
            await _s3Client.PutBucketAsync(new PutBucketRequest
            {
                BucketName = _bucketName
            }, cancellationToken);

            // Set bucket policy to public-read for serving images directly
            var policy = $$"""
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": "arn:aws:s3:::{{_bucketName}}/*"
                    }
                ]
            }
            """;

            await _s3Client.PutBucketPolicyAsync(new PutBucketPolicyRequest
            {
                BucketName = _bucketName,
                Policy = policy
            }, cancellationToken);

            _logger.LogInformation("Bucket {Bucket} created with public-read policy", _bucketName);
        }

        _bucketEnsured = true;
    }
}
