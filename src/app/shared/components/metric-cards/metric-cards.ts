import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { tablerTrendingDown, tablerTrendingUp } from '@ng-icons/tabler-icons';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';

export interface MetricCard {
  description: string;
  value: string;
  trend: string;
  trendIcon: 'tablerTrendingUp' | 'tablerTrendingDown';
  footerTitle: string;
  footerNote: string;
}

@Component({
  selector: 'app-metric-cards',
  imports: [HlmCardImports, HlmBadgeImports, HlmIconImports],
  providers: [provideIcons({ tablerTrendingUp, tablerTrendingDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
      @for (card of cards(); track card.description) {
        <div hlmCard class="from-primary/5 to-card dark:bg-card bg-gradient-to-t shadow-xs">
          <div hlmCardHeader class="relative">
            <p hlmCardDescription>{{ card.description }}</p>
            <h3 hlmCardTitle class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {{ card.value }}
            </h3>
            <div class="absolute right-4 top-4">
              <span hlmBadge variant="outline" class="flex gap-1 rounded-lg text-xs">
                <ng-icon hlm [name]="card.trendIcon" size="xs"></ng-icon>
                {{ card.trend }}
              </span>
            </div>
          </div>
          <div hlmCardFooter class="flex-col items-start gap-1 text-sm">
            <div class="line-clamp-1 flex gap-2 font-medium">
              {{ card.footerTitle }}
              <ng-icon hlm [name]="card.trendIcon" size="sm"></ng-icon>
            </div>
            <p class="text-muted-foreground">{{ card.footerNote }}</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class MetricCards {
  readonly cards = input.required<MetricCard[]>();
}
