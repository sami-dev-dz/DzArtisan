<?php

namespace App\Helpers;

use Carbon\Carbon;

class BusinessDayHelper
{
    /**
     * Algerian business days: Sunday to Thursday
     */
    public const BUSINESS_DAYS = [
        Carbon::SUNDAY,
        Carbon::MONDAY,
        Carbon::TUESDAY,
        Carbon::WEDNESDAY,
        Carbon::THURSDAY,
    ];

    /**
     * Add business days to a date, skipping Friday and Saturday
     */
    public static function addBusinessDays(Carbon $date, int $days): Carbon
    {
        $date = $date->copy();
        while ($days > 0) {
            $date->addDay();
            if (in_array($date->dayOfWeek, self::BUSINESS_DAYS)) {
                $days--;
            }
        }
        return $date;
    }

    /**
     * Difference in business days between two dates
     */
    public static function diffInBusinessDays(Carbon $start, Carbon $end): int
    {
        return $start->diffInDaysFiltered(function (Carbon $date) {
            return in_array($date->dayOfWeek, self::BUSINESS_DAYS);
        }, $end);
    }

    /**
     * Is the given date a business day?
     */
    public static function isBusinessDay(Carbon $date): bool
    {
        return in_array($date->dayOfWeek, self::BUSINESS_DAYS);
    }

    /**
     * Get next business day if currently weekend
     */
    public static function nextBusinessDay(Carbon $date): Carbon
    {
        $date = $date->copy();
        while (!self::isBusinessDay($date)) {
            $date->addDay();
        }
        return $date;
    }
}
