import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Drawer from "@/components/Drawer";
import ChipGroup from "@/components/ChipGroup";
import MatchLoader from "@/components/MatchLoader";
import PlaceholderImage from "@/components/PlaceholderImage";
import { useApp } from "@/lib/AppContext";
import { occasionName } from "@/data/catalog";
import { BUDGETS, matchesFor, readNote } from "@/lib/stylist";
import { dayISO, todayISO } from "@/lib/dates";

const STEP_ORDER = [
  "occasion",
  "event_date",
  "size",
  "piece_type",
  "fit",
  "budget",
  "country",
  "postcode",
  "note",
];
const REQUIRED = ["occasion", "event_date", "size", "country"];

const BUDGET_OPTIONS = BUDGETS.map((budget) => ({
  value: budget.value,
  label: budget.label,
}));
const COUNTRY_OPTIONS = [
  { value: "UK", label: "UK" },
  { value: "EU", label: "EU" },
];
const PIECE_TYPE_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "dress", label: "Dress" },
  { value: "jumpsuit", label: "Jumpsuit" },
  { value: "separates", label: "Separates" },
  { value: "outerwear", label: "Outerwear" },
  { value: "accessories", label: "Accessories" },
];
const FIT_OPTIONS = [
  { value: "any", label: "No preference" },
  { value: "relaxed", label: "Relaxed" },
  { value: "structured", label: "Structured" },
  { value: "draped", label: "Draped" },
  { value: "fitted", label: "Fitted" },
  { value: "column", label: "Column" },
  { value: "wrap", label: "Wrap" },
  { value: "a-line", label: "A-line" },
  { value: "bias", label: "Bias-cut" },
];

const MAX_NOTE = 500;
const MATCH_PRODUCTS_URL =
  "https://velmora-mock-project.app.n8n.cloud/webhook/velmora-match-products";

const budgetRange = (value) => {
  const budget = BUDGETS.find((option) => option.value === value);
  return {
    min_gbp: 0,
    max_gbp: budget?.max ?? null,
  };
};

const answerList = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export default function StylistDrawer() {
  const { stylistOpen, closeStylist, answers, setAnswer, clearStylist } =
    useApp();
  const router = useRouter();
  const [step, setStep] = useState("occasion");
  const [note, setNote] = useState("");
  const [postcode, setPostcode] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResponse, setMatchResponse] = useState();
  const [matchError, setMatchError] = useState("");

  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Each time the drawer opens, resume at the first question left unanswered.
  useEffect(() => {
    if (!stylistOpen) return;
    const current = answersRef.current;
    const missing = REQUIRED.find((key) => !current[key]);
    setNote("");
    setPostcode("");
    setStep(missing || "occasion");
    setShowResults(!missing);
  }, [stylistOpen]);

  const steps = useMemo(
    () =>
      STEP_ORDER.filter(
        (key) => key !== "postcode" || answers.country !== "EU",
      ),
    [answers.country],
  );

  const noteReading = readNote(note);
  const postcodeReading = readNote(postcode);
  const formPayload = useMemo(
    () => ({
      occasion: answerList(answers.occasion),
      event_date: answers.event_date || null,
      size: answerList(answers.size),
      budget: budgetRange(answers.budget),
      delivery: {
        country: answers.country || null,
        outward_postcode: postcode || null,
      },
      preferences: {
        category: answers.piece_type || "any",
        fit: answers.fit && answers.fit !== "any" ? answers.fit : null,
        colours: answers.colours || [],
        fabrics: answers.fabrics || [],
        notes: note || null,
      },
      description: note || "",
    }),
    [answers, note, postcode],
  );

  let failed = false;
  try {
    matchesFor(answers);
  } catch {
    failed = true;
  }

  const stepIndex = steps.indexOf(step);
  const progress = showResults ? 1 : (stepIndex + 1) / steps.length;

  const goNext = () => {
    if (step === "note" && noteReading.type === "address") return;
    if (stepIndex !== steps.length - 1) {
      setStep(steps[stepIndex + 1]);
      return;
    }

    setShowResults(true);
    setMatchLoading(true);
    setMatchResponse(undefined);
    setMatchError("");

    void fetch(MATCH_PRODUCTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formPayload),
    })
      .then(async (response) => {
        const responseText = await response.text();
        let responseData;

        try {
          responseData = responseText ? JSON.parse(responseText) : null;
        } catch {
          throw new Error("The matching service returned an invalid response.");
        }

        if (!response.ok) {
          throw new Error(
            responseData?.message ||
              `The matching service returned status ${response.status}.`,
          );
        }

        setMatchResponse(responseData);
      })
      .catch((error) => {
        setMatchError(
          error instanceof Error
            ? error.message
            : "The matching service is unavailable.",
        );
      })
      .finally(() => setMatchLoading(false));
  };

  const goBack = () => {
    if (showResults) {
      setShowResults(false);
      setStep(steps[steps.length - 1]);
      return;
    }
    if (stepIndex > 0) setStep(steps[stepIndex - 1]);
  };

  const browseOccasions = () => {
    closeStylist();
    router.push("/");
    window.setTimeout(() => {
      document.getElementById("occasions")?.scrollIntoView({ block: "start" });
    }, 80);
  };

  const openPiece = (piece) => {
    closeStylist();
    router.push(`/product/${piece.slug}`);
  };

  const handleClear = () => {
    clearStylist();
    setNote("");
    setPostcode("");
    setShowResults(false);
    setStep("occasion");
    setMatchLoading(false);
    setMatchResponse(undefined);
    setMatchError("");
  };

  const canContinue =
    step === "occasion"
      ? answerList(answers.occasion).length > 0
      : step === "event_date"
        ? Boolean(answers.event_date)
        : step === "size"
          ? answerList(answers.size).length > 0
          : step === "piece_type"
            ? true
            : step === "fit"
              ? true
              : step === "country"
                ? Boolean(answers.country)
                : true;

  const footer = (
    <div>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBack}
          disabled={!showResults && stepIndex <= 0}
          className="min-h-[44px] text-xs uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-ink disabled:opacity-40"
        >
          Back
        </button>
        <div>
          <button
            type="button"
            onClick={handleClear}
            className="min-h-[44px] text-xs uppercase tracking-[0.18em] text-ink/70 underline decoration-stone underline-offset-4 transition-colors hover:text-ink"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={showResults ? closeStylist : goNext}
            disabled={!showResults && !canContinue}
            className="min-h-[48px] bg-oxblood px-7 text-xs uppercase tracking-[0.2em] text-ivory transition-opacity disabled:opacity-40"
          >
            {showResults
              ? "Close"
              : step === "note"
                ? "See pieces"
                : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );

  const results = () => {
    if (failed) {
      return (
        <div className="border border-stone/70 p-5">
          <p className="text-sm leading-relaxed text-ink">
            The stylist is not available. You can still browse by occasion.
          </p>
          <button
            type="button"
            onClick={browseOccasions}
            className="mt-4 min-h-[44px] text-sm text-oxblood underline decoration-stone underline-offset-4"
          >
            Browse by occasion
          </button>
        </div>
      );
    }

    return (
      <>
        {matchResponse?.summary && (
          <p className="border-l border-oxblood pl-4 text-sm leading-relaxed text-ink/85">
            {matchResponse.summary}
          </p>
        )}

        {noteReading.type === "unknown" && (
          <p className="border border-stone/70 p-4 text-sm leading-relaxed text-ink">
            I don't have that information. The product page has the full
            details.
          </p>
        )}

        {noteReading.type === "ok" && noteReading.reply && (
          <p className="border-l border-oxblood pl-4 text-sm leading-relaxed text-ink/85">
            {noteReading.reply}
          </p>
        )}

        {matchResponse.recommendations.length === 0 ? (
          <div className="border border-stone/70 p-5">
            <p className="text-sm leading-relaxed text-ink">
              No recommended products are available yet. A lower budget or a
              later date would help.
            </p>
            <button
              type="button"
              onClick={goBack}
              className="mt-4 min-h-[44px] text-sm text-oxblood underline decoration-stone underline-offset-4"
            >
              Change my answers
            </button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {matchResponse.recommendations.slice(0, 5).map((recommendation) => (
              <li key={recommendation.id}>
                <button
                  type="button"
                  onClick={() => openPiece({ slug: recommendation.id })}
                  className="block w-full border border-stone/70 p-3 text-left transition-colors hover:border-ink"
                >
                  <div className="flex gap-4">
                    <span className="w-20 shrink-0">
                      <PlaceholderImage
                        image={recommendation.image}
                        ratio="1 / 1"
                        label={recommendation.name}
                      />
                    </span>
                    <span className="block">
                      <span className="block font-heading text-lg font-light">
                        {recommendation.name}
                      </span>
                      <span className="mt-1 block text-sm">
                        Match score: {recommendation.score}
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-ink/80">
                        {recommendation.reason}
                      </span>
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  return (
    <Drawer
      open={stylistOpen}
      onClose={closeStylist}
      title="Velmora Stylist"
      label="Velmora Stylist"
      note="Your answers stay on this device."
      footer={footer}
      panelClassName="h-[min(88vh,52rem)] self-end rounded-t-2xl animate-rise-in md:w-2/3 md:border-l-0 md:border-t md:border-stone"
    >
      <div
        key={showResults ? "results" : step}
        className="px-6 py-6 animate-rise-in"
      >
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-stone">
            <div
              className="h-px bg-oxblood transition-[width] duration-300"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="eyebrow text-ink/60">
            {showResults
              ? "Results"
              : `Step ${stepIndex + 1} of ${steps.length}`}
          </span>
        </div>

        {showResults ? (
          <div className="mt-8 space-y-5">
            <div>
              <h3 className="font-heading text-2xl font-light md:text-3xl">
                {matchResponse?.recommendations?.length || 0}{" "}
                {matchResponse?.recommendations?.length === 1
                  ? "piece matches"
                  : "pieces match"}{" "}
                your answers.
              </h3>
              {/* {answerList(answers.occasion).length > 0 && (
                <p className="mt-2 text-sm text-ink/75">
                  {answerList(answers.occasion).map(occasionName).join(", ")},{" "}
                  {answerList(answers.size).join(", ")}, delivered to{" "}
                  {answers.country}
                  {answers.event_date
                    ? `, needed by ${dayISO(answers.event_date)}`
                    : ""}
                  .
                </p>
              )} */}
            </div>
            {matchLoading && <MatchLoader />}
            {!matchLoading && matchError && (
              <div className="border border-oxblood/30 bg-oxblood/5 p-4">
                <p className="text-sm text-oxblood">{matchError}</p>
                <button
                  type="button"
                  onClick={goNext}
                  className="mt-3 text-xs uppercase tracking-[0.2em] text-oxblood underline underline-offset-4"
                >
                  Try again
                </button>
              </div>
            )}
            {!matchLoading && !matchError && matchResponse !== undefined && results()}
          </div>
        ) : (
          <div className="mt-8">
            {step === "occasion" && (
              <>
                <h3 className="font-heading text-2xl font-light">
                  What is the occasion?
                </h3>
                <ChipGroup
                  className="mt-6"
                  name="occasion"
                  value={answerList(answers.occasion)}
                  onChange={(value) => setAnswer("occasion", value)}
                />
              </>
            )}

            {step === "event_date" && (
              <>
                <h3 className="font-heading text-2xl font-light">
                  When is the event?
                </h3>
                <div className="mt-6">
                  <label
                    htmlFor="event-date"
                    className="eyebrow block text-ink/70"
                  >
                    Event date
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    min={todayISO()}
                    value={answers.event_date || ""}
                    onChange={(event) =>
                      setAnswer("event_date", event.target.value)
                    }
                    className="mt-3 min-h-[48px] w-full border border-stone bg-transparent px-3 py-2 text-sm text-ink"
                  />
                  <p className="mt-3 text-sm text-ink/70">
                    Used only to work out whether a piece can be made and
                    delivered in time.
                  </p>
                </div>
              </>
            )}

            {step === "size" && (
              <>
                <h3 className="font-heading text-2xl font-light">
                  Which size do you wear?
                </h3>
                <ChipGroup
                  className="mt-6"
                  name="size"
                  value={answerList(answers.size)}
                  onChange={(value) => setAnswer("size", value)}
                />
              </>
            )}

            {step === "budget" && (
              <>
                <h3 className="font-heading text-2xl font-light">
                  What is your budget?
                </h3>
                <p className="eyebrow mt-3 text-ink/60">Optional</p>
                <ChipGroup
                  className="mt-6"
                  name="budget"
                  value={answers.budget}
                  onChange={(value) => setAnswer("budget", value)}
                  options={BUDGET_OPTIONS}
                />
              </>
            )}

            {step === "piece_type" && (
              <>
                <h3 className="font-heading text-2xl font-light">
                  What kind of piece are you looking for?
                </h3>
                <p className="eyebrow mt-3 text-ink/60">Optional</p>
                <ChipGroup
                  className="mt-6"
                  name="piece-type"
                  value={answers.piece_type || "any"}
                  onChange={(value) => setAnswer("piece_type", value)}
                  options={PIECE_TYPE_OPTIONS}
                />
              </>
            )}

            {step === "fit" && (
              <>
                <h3 className="font-heading text-2xl font-light">
                  What fit do you prefer?
                </h3>
                <p className="eyebrow mt-3 text-ink/60">Optional</p>
                <ChipGroup
                  className="mt-6"
                  name="fit"
                  value={answers.fit || "any"}
                  onChange={(value) => setAnswer("fit", value)}
                  options={FIT_OPTIONS}
                />
              </>
            )}

            {step === "country" && (
              <>
                <h3 className="font-heading text-2xl font-light">
                  Where should it be delivered?
                </h3>
                <ChipGroup
                  className="mt-6"
                  name="country"
                  value={answers.country}
                  onChange={(value) => setAnswer("country", value)}
                  options={COUNTRY_OPTIONS}
                />
              </>
            )}

            {step === "postcode" && (
              <>
                <h3 className="font-heading text-2xl font-light">
                  Which part of the UK?
                </h3>
                <div className="mt-6">
                  <label
                    htmlFor="outward-postcode"
                    className="eyebrow block text-ink/70"
                  >
                    Outward postcode
                  </label>
                  <input
                    id="outward-postcode"
                    type="text"
                    maxLength={10}
                    placeholder="e.g. SW1"
                    value={postcode}
                    onChange={(event) => setPostcode(event.target.value)}
                    className="mt-3 min-h-[48px] w-full border border-stone bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink/45"
                  />
                  <p className="mt-3 text-sm text-ink/70">
                    The first part only. Your address belongs at checkout.
                  </p>
                  {postcodeReading.type === "address" && (
                    <p className="mt-3 text-sm text-oxblood" role="alert">
                      Please enter your address at checkout. I can't use it
                      here.
                    </p>
                  )}
                </div>
              </>
            )}

            {step === "note" && (
              <>
                <h3 className="font-heading text-2xl font-light">
                  Anything else?
                </h3>
                <p className="eyebrow mt-3 text-ink/60">Optional</p>
                <div className="mt-6">
                  <label
                    htmlFor="stylist-note"
                    className="eyebrow block text-ink/70"
                  >
                    Your note
                  </label>
                  <textarea
                    id="stylist-note"
                    rows={4}
                    maxLength={MAX_NOTE}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className="mt-3 w-full border border-stone bg-transparent px-3 py-3 text-sm leading-relaxed text-ink"
                  />
                  {note.length >= MAX_NOTE - 100 && (
                    <p className="mt-2 text-xs text-ink/70">
                      {note.length} of {MAX_NOTE} characters
                    </p>
                  )}
                  <p className="mt-3 text-sm text-ink/70">
                    Fabric, fit, delivery dates. No address, phone number or
                    card details.
                  </p>
                  {(noteReading.type === "address" ||
                    postcodeReading.type === "address") && (
                    <p className="mt-3 text-sm text-oxblood" role="alert">
                      Please enter your address at checkout. I can't use it
                      here.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}
