import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private readonly http: HttpClient, private readonly sanitizer: DomSanitizer) {}

  /**
   * Generate a random number between min and max
   * @param min
   * @param max
   * @returns
   */
  public generateRandomNumber(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Fetch file data from a given URI and optionally check the mime type
   * @param fileUri
   * @param expectedMimeType
   * @returns
   */
  public async fetchFileDataURL(fileUri: string, expectedMimeType?: string): Promise<any> {
    try {
      const response = await this.http.get(fileUri, { responseType: 'blob' }).toPromise();

      if (!response) {
        throw new Error('Could not fetch the given URI');
      }

      const options: FilePropertyBag = {};
      if (expectedMimeType) {
        options.type = expectedMimeType;
      }

      const file = new File([response], `file-${Date.now()}`, options);
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    } catch (e) {
      console.error(e);
      throw new Error('Could not fetch the given URI');
    }
  }
}
