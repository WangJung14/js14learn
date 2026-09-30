import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly supabase: ReturnType<typeof createClient>;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>(
      'SUPABASE_SERVICE_KEY',
    );
    this.bucketName =
      this.configService.get<string>('SUPABASE_STORAGE_BUCKET') ||
      'submissions';

    if (!supabaseUrl || !supabaseServiceKey) {
      this.logger.warn(
        'Supabase URL or Service Key is missing from ConfigService!',
      );
    }

    this.supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  /**
   * Upload file buffer to Supabase Storage
   */
  async uploadFile(
    objectPath: string,
    fileBuffer: Buffer,
    contentType: string,
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(objectPath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      this.logger.error(
        `Failed to upload object to Supabase Storage (${objectPath}): ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Storage upload failed: ${error.message}`,
      );
    }

    return data.path;
  }

  /**
   * Delete object from Supabase Storage (used for cleanup or file deletion)
   */
  async deleteFile(objectPath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([objectPath]);

    if (error) {
      this.logger.error(
        `Failed to delete object from Supabase Storage (${objectPath}): ${error.message}`,
      );
    }
  }

  /**
   * Create signed URL for private bucket access (default 1 hour expiry)
   */
  async createSignedUrl(
    objectPath: string,
    expiresInSeconds = 3600,
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUrl(objectPath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      this.logger.error(
        `Failed to create signed URL for object (${objectPath}): ${error?.message}`,
      );
      throw new InternalServerErrorException(
        `Could not generate signed access URL`,
      );
    }

    return data.signedUrl;
  }
}
