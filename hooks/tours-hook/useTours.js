// hooks/tours-hook/useTours.js
import { useQuery } from "@tanstack/react-query";
import { getTours } from "../../apis/tours/tour";

/**
 * @typedef {Object} Tour
 * @property {string} _id
 * @property {string} title
 * @property {string} [description]
 * @property {string} [destination]
 * @property {string} [destinationSlug]
 * @property {string} [time]
 * @property {string} [startDate]
 * @property {string} [endDate]
 * @property {number} [priceAdult]
 * @property {number} [priceChild]
 * @property {number} [quantity]
 * @property {string} [image]
 * @property {string} [cover]
 */

/** @param {any} raw @returns {Tour[]} */
function normalizeTours(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

export const useGetTours = () =>
  useQuery({
    queryKey: ["getTours"],
    queryFn: getTours,
    /** @returns {Tour[]} */
    select: (raw) => normalizeTours(raw),
    placeholderData: [],
    staleTime: 60_000,
  });
