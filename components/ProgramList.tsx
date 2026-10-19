"use client";

import { useCallback, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Program Kerja list: plain names, one visual row per line, and a   */
/* "|" divider at BOTH ends of every row.                            */
/*                                                                   */
/* How the rows are found:                                            */
/*  1. A first measuring pass renders every item in one flat flow,   */
/*     so the browser decides where the text breaks. Items are       */
/*     grouped by their vertical offset -> one group per line.       */
/*  2. Each group is then rendered as its own row with a divider at  */
/*     the left and the right edge. If a row turns out to be too     */
/*     wide, its last item moves to a new row and the layout is     */
/*     measured again (a few iterations max).                        */
/*                                                                   */
/* The measurement runs from a ref callback instead of an effect so  */
/* no state is set synchronously inside an effect body.              */
/* ------------------------------------------------------------------ */

export interface ProgramListItem {
  id: string;
  name: string;
  href?: string | null;
}

const MAX_ITERATIONS = 8;

function Divider() {
  return (
    <span aria-hidden className="select-none px-2 text-white/40">
      |
    </span>
  );
}

function Item({ item }: { item: ProgramListItem }) {
  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-brand-yellow hover:decoration-brand-yellow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow"
      >
        {item.name}
      </a>
    );
  }
  return <span>{item.name}</span>;
}

export default function ProgramList({ items }: { items: ProgramListItem[] }) {
  const [groups, setGroups] = useState<number[][] | null>(null);
  const iterations = useRef(0);
  const lastSignature = useRef<string | null>(null);
  const signature = items.map((item) => item.id).join(",");

  // Ref callback: runs after every commit that changes the tree, so the
  // layout can be measured without an effect.
  const measure = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      // A new set of items invalidates the previous measurement.
      if (lastSignature.current !== signature) {
        lastSignature.current = signature;
        iterations.current = 0;
        if (groups !== null) {
          setGroups(null);
          return;
        }
      }

      // Pass 1 - the flat measuring pass is still on screen: group the items
      // by their vertical offset to find out where the lines break.
      if (groups === null) {
        const nodes = Array.from(
          node.querySelectorAll<HTMLElement>("[data-program-index]"),
        );
        const result: number[][] = [];
        let currentTop: number | null = null;

        for (const itemNode of nodes) {
          const top = itemNode.offsetTop;
          if (currentTop === null || Math.abs(top - currentTop) > 2) {
            result.push([]);
            currentTop = top;
          }
          result[result.length - 1].push(
            Number(itemNode.dataset.programIndex),
          );
        }

        setGroups(result);
        return;
      }

      // Pass 2 - a rendered row is wider than the space it has: move its last
      // item to a new row and measure again.
      if (iterations.current >= MAX_ITERATIONS) return;

      const rows = Array.from(
        node.querySelectorAll<HTMLElement>("[data-program-row]"),
      );
      const overflowing = rows.find(
        (row) => row.scrollWidth > row.clientWidth + 1,
      );
      if (!overflowing) return;

      const rowIndex = Number(overflowing.dataset.programRow);
      const group = groups[rowIndex];
      if (!group || group.length < 2) return;

      iterations.current += 1;
      const next = [...groups];
      next.splice(rowIndex + 1, 0, [group[group.length - 1]]);
      next[rowIndex] = group.slice(0, -1);
      setGroups(next);
    },
    [groups, signature],
  );

  return (
    <div
      ref={measure}
      className="mt-6 text-center text-white sm:text-lg md:text-xl lg:text-2xl"
    >
      {groups === null ? (
        /* Measuring pass: one flat run, so the browser decides the breaks.
           The divider sits after each item (plus one leading divider), which
           is exactly how a finished row is laid out. */
        <div className="flex flex-wrap items-center justify-center">
          <Divider />
          {items.map((item, index) => (
            <span
              key={item.id}
              data-program-index={index}
              className="inline-flex items-center whitespace-nowrap"
            >
              <Item item={item} />
              <Divider />
            </span>
          ))}
        </div>
      ) : (
        groups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            data-program-row={groupIndex}
            className="flex w-full flex-nowrap items-center justify-center whitespace-nowrap"
          >
            <Divider />
            {group.map((itemIndex, position) => {
              const item = items[itemIndex];
              if (!item) return null;
              return (
                <span
                  key={item.id}
                  data-program-index={itemIndex}
                  className="inline-flex items-center whitespace-nowrap"
                >
                  {position > 0 && <Divider />}
                  <Item item={item} />
                </span>
              );
            })}
            <Divider />
          </div>
        ))
      )}
    </div>
  );
}
