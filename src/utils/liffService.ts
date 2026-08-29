import liff from '@line/liff';
import { UserProfile } from '../types';

export const DEFAULT_LIFF_ID = '2011321555-jl54Ygfm';

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

class LiffManager {
  private isInitialized = false;
  private liffId: string = '2011321555-jl54Ygfm';

  constructor() {
    const savedLiffId = localStorage.getItem('webquest_liff_id');
    if (savedLiffId) {
      this.liffId = savedLiffId;
    }
  }

  public getSavedLiffId(): string {
    return this.liffId;
  }

  public setLiffId(id: string) {
    this.liffId = id.trim();
    localStorage.setItem('webquest_liff_id', this.liffId);
  }

  public async initLiff(customLiffId?: string): Promise<{ success: boolean; profile?: LiffProfile; error?: string }> {
    const targetLiffId = (customLiffId || this.liffId || DEFAULT_LIFF_ID).trim();
    if (!targetLiffId || targetLiffId.includes('xxxxxx')) {
      return {
        success: false,
        error: 'กรุณาระบุ LIFF ID จาก LINE Developers Console',
      };
    }

    try {
      if (!this.isInitialized) {
        await liff.init({ liffId: targetLiffId });
        this.isInitialized = true;
        this.setLiffId(targetLiffId);
      }

      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        return {
          success: true,
          profile: {
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage,
          },
        };
      } else {
        return {
          success: false,
          error: 'ยังไม่ได้เข้าสู่ระบบ LINE',
        };
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: errMsg,
      };
    }
  }

  public login(redirectUri?: string) {
    if (liff.isLoggedIn()) return;
    if (redirectUri) {
      liff.login({ redirectUri });
    } else {
      liff.login();
    }
  }

  public logout() {
    if (liff.isLoggedIn()) {
      liff.logout();
    }
  }

  public isInClient(): boolean {
    try {
      return liff.isInClient();
    } catch {
      return false;
    }
  }

  public isLoggedIn(): boolean {
    try {
      return liff.isLoggedIn();
    } catch {
      return false;
    }
  }
}

export const liffManager = new LiffManager();
