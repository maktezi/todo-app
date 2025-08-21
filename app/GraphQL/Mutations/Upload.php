<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

final readonly class Upload
{
    /**
     * Upload a file, store it on the server and return the path.
     *
     * @param  array<string, mixed>  $args
     */
    public function __invoke(mixed $root, array $args): ?string
    {
        /** @var \Illuminate\Http\UploadedFile $file */
        $file = $args['file'];

        return $file->storePublicly('uploads');
    }
}
