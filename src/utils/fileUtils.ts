// src/utils/fileUtils.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'colors';

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Checks and creates necessary directories for file uploads.
 * @param baseDir Optional: Relative path from project root for the base upload directory (defaults to 'uploadFile').
 * @param folders Optional: Array of subfolder names to create within the base directory.
 */
export function createUploadDirectories(
    baseDir: string = 'uploadFile',
    folders: string[] = ['images', 'audios', 'pdfs', 'videos', 'docs', 'others', 'temp'] // Added 'temp'
): void {
    const defaultFolders: string[] = ['images', 'audios', 'pdfs', 'videos', 'docs', 'others', 'temp'];
    const projectRoot = path.resolve(__dirname, '../../'); // Go up two levels from src/utils
    const finalBaseDir = path.join(projectRoot, baseDir);
    const finalFolders = folders || defaultFolders;

    try {
        // Check if base directory exists, if not create it
        if (!fs.existsSync(finalBaseDir)) {
            fs.mkdirSync(finalBaseDir, { recursive: true });
            console.log(`Created base upload directory: ${finalBaseDir}`.magenta);
        }

        // Iterate through the subfolders and create them if they don't exist
        finalFolders.forEach(folder => {
            const folderPath = path.join(finalBaseDir, folder);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                console.log(`  Created upload subfolder: ${folderPath}`.green);
            }
        });
    } catch (error) {
        console.error(`Error creating upload directories in ${finalBaseDir}:`.red, error);
    }
}

// You could add other file utility functions here, like deleting files:
/**
 * Deletes a file specified by its path relative to the project root.
 * @param filePath Relative path to the file from the project root (e.g., 'uploadFile/images/image.jpg').
 */
export const deleteFile = (filePath: string): void => {
  const projectRoot = path.resolve(__dirname, '../../');
  const absolutePath = path.join(projectRoot, filePath);
  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.warn(`File not found for deletion: ${absolutePath}`.yellow);
      return;
    }
    fs.unlink(absolutePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(`Error deleting file: ${absolutePath}`.red, unlinkErr);
      } else {
        console.log(`Successfully deleted file: ${absolutePath}`.grey);
      }
    });
  });
};
