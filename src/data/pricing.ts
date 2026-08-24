/**
 * Room pricing, kept in one place so a rate change is a single edit.
 *
 * These are the rate-card figures, effective for agreements beginning
 * 1 January 2027. The card is set once and used twice: spring 2027 re-lets
 * first, then carried unchanged into the 2027-28 academic year, with no
 * mid-year step. The 2026-27 rates it replaces were:
 *
 *   private   academic 1545 (from)   full 1495 (from)
 *   double    academic 1095          full 1045
 *
 * The twelve-month rate is the headline, because that is the basis every
 * apartment advertises on and the only number a student compares. The
 * nine-month academic year is sold as an upgrade on top of it, and the card
 * widens that premium from $50 to $200-$300 precisely so it is worth selling.
 *
 * Private rates are floors: the card runs five tiers from Entry (105, 280) up
 * to Top (270, 275). The site quotes the Entry rate and the tier is settled in
 * conversation once a room is chosen.
 *
 * Room 340 is the only dorm room in the building and the card does not price
 * it, because the card assumes it converts to three private rooms. The dorm
 * figures below are therefore still the 2026-27 ones. If the conversion is
 * confirmed the tier should come off the site entirely rather than be repriced.
 */

export interface RoomTier {
  /** Nine-month academic-year rate, mid-September to mid-June. Sold as the upgrade. */
  academic: number;
  /** Twelve-month rate. The headline, and what an apartment listing compares against. */
  full: number;
  /** True when the tier spans several rooms and the rate is a floor, not a price. */
  from: boolean;
}

export type TierKey = 'private' | 'double' | 'dorm';

export const pricing: Record<TierKey, RoomTier> = {
  private: { academic: 1645, full: 1345, from: true },
  double: { academic: 1195, full: 995, from: false },
  // Not on the new card — see the note above. 2026-27 figures, pending 340's survey.
  dorm: { academic: 995, full: 945, from: false },
};

/** Quoted wherever rates appear, so nobody reads them as today's price. */
export const RATES_EFFECTIVE = 'January 2027';

/**
 * Nothing on this site goes below this figure, on either term. The dorm's
 * twelve-month rate sits exactly on it, which is the reason it exists: the
 * tier stays listed while 340's future is unsettled, but it does not become
 * a cheaper way in. Raise the floor rather than discount beneath it.
 */
export const RATE_FLOOR = 945;

const money = (amount: number): string => `$${amount.toLocaleString('en-US')}`;

/** Headline price: the twelve-month rate, quoted the way an apartment quotes. */
export const priceLabel = (tier: RoomTier): string =>
  `${tier.from ? 'From ' : ''}${money(tier.full)}/mo`;

/** The academic-year alternative, offered as an upgrade on the headline. */
export const priceNote = (tier: RoomTier): string =>
  `or ${money(tier.academic)}/mo Sept–June`;
