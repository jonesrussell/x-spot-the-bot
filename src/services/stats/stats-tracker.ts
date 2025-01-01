interface BotStats {
  highProbability: number;
  mediumProbability: number;
  lowProbability: number;
}

export class StatsTracker {
  #processedUsernames = new Set<string>();
  #stats: BotStats = {
    highProbability: 0,
    mediumProbability: 0,
    lowProbability: 0
  };
  #lastSummaryTime = 0;
  readonly #SUMMARY_INTERVAL = 2000; // Log summary every 2 seconds

  public reset(): void {
    this.#processedUsernames.clear();
    this.#stats = {
      highProbability: 0,
      mediumProbability: 0,
      lowProbability: 0
    };
    this.#lastSummaryTime = 0;
  }

  public isProcessed(username: string): boolean {
    return this.#processedUsernames.has(username);
  }

  public markProcessed(username: string): void {
    this.#processedUsernames.add(username);
  }

  public trackAnalysis(probability: number): void {
    if (probability >= 0.6) {
      this.#stats.highProbability++;
    } else if (probability >= 0.3) {
      this.#stats.mediumProbability++;
    } else {
      this.#stats.lowProbability++;
    }
  }

  public getStats(): BotStats {
    return { ...this.#stats };
  }

  public logSummary(): void {
    const now = Date.now();
    if (now - this.#lastSummaryTime < this.#SUMMARY_INTERVAL) return;
    
    const total = this.#processedUsernames.size;
    if (total === 0) return;

    console.log('[XBot] Bot Detection Summary:',
      `\n🔍 Total Analyzed: ${total}`,
      `\n🤖 High Risk: ${this.#stats.highProbability}`,
      `\n⚠️ Medium Risk: ${this.#stats.mediumProbability}`,
      `\n✓ Likely Real: ${this.#stats.lowProbability}`
    );
    this.#lastSummaryTime = now;
  }
} 