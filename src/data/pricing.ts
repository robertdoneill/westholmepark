/**
 * Room pricing, kept in one place so a rate change is a single edit.
 *
 * These are the rate-card figures, effective for agreements beginning
 * 1 January 2027. The card is set once and used twice: spring 2027 re-lets
 * first, then carried unchanged into the 2027-28 academic year, with no
 * mid-year step. Source of truth: docs/westholme-rate-card.html in the hostel
 * repo, published at claude.ai/code/artifact/f0be8b6c.
 *
 * The twelve-month rate is the headline, because that is the basis every
 * apartment advertises on and the only number a student compares. The
 * nine-month academic year is sold as an upgrade on top of it.
 *
 * Note what that means here: the card holds every twelve-month rate at or
 * above today's, so the public headline does not move. The whole increase
 * lands on the nine-month term, which is the one the card wants to be
 * expensive -- it would rather fill the year than the academic term.
 *
 * Both tiers below are floors. Privates run five tiers from Entry (105, 280)
 * up to Top (270, 275); doubles run three, with 350 and 355 carrying a premium
 * for being newly split rather than larger. The site quotes the entry rate of
 * each and the tier is settled in conversation once a room is chosen.
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
  // Entry tier: 105, 280. Runs up to Top (270, 275) at 1945 / 1745.
  private: { academic: 1745, full: 1545, from: true },
  // Standard tier: the eleven unmeasured rooms. 350 and 355 sit above it.
  double: { academic: 1245, full: 1095, from: true },
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
