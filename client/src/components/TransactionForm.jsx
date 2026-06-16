import { useMemo, useState } from "react"

import { getUser, transactionApi } from "../services/api"

const SAVED_CATEGORY_KEY = "pocketledger_saved_categories"

const normalizeCategory = (value) => value.trim()

const getSavedCategoryKey = () => {
  const user = getUser()
  return user?.id ? `${SAVED_CATEGORY_KEY}_${user.id}` : SAVED_CATEGORY_KEY
}

const readSavedCategories = () => {
  try {
    return JSON.parse(localStorage.getItem(getSavedCategoryKey())) || []
  } catch {
    return []
  }
}

const saveCategories = (categories) => {
  localStorage.setItem(getSavedCategoryKey(), JSON.stringify(categories))
}

const formatDateInputValue = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : ""

function CategoryPicker({
  value,
  onChange,
  transactions,
  savedCategories,
  onCreateTag,
  onDeleteTag,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const query = value.toLowerCase()

  const usageByCategory = useMemo(() => {
    return transactions.reduce((usage, transaction) => {
      const category = normalizeCategory(transaction.category || "")

      if (!category) {
        return usage
      }

      usage[category.toLowerCase()] = (usage[category.toLowerCase()] || 0) + 1
      return usage
    }, {})
  }, [transactions])

  const categories = useMemo(() => {
    const names = new Map()

    transactions.forEach((transaction) => {
      const category = normalizeCategory(transaction.category || "")

      if (category) {
        names.set(category.toLowerCase(), category)
      }
    })

    savedCategories.forEach((category) => {
      const normalized = normalizeCategory(category)

      if (normalized) {
        names.set(normalized.toLowerCase(), normalized)
      }
    })

    return [...names.values()].sort((first, second) =>
      first.localeCompare(second),
    )
  }, [savedCategories, transactions])

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(query),
  )
  const normalizedValue = normalizeCategory(value)
  const categoryExists = categories.some(
    (category) => category.toLowerCase() === normalizedValue.toLowerCase(),
  )

  const handleCreate = () => {
    if (!normalizedValue || categoryExists) {
      return
    }

    onCreateTag(normalizedValue)
    onChange(normalizedValue)
    setIsOpen(true)
  }

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-slate-600">
        Category tag
      </label>

      <input
        type="text"
        placeholder="Choose or create a tag"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        required
      />

      {isOpen && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          onMouseDown={(event) => event.preventDefault()}
        >
          <div className="max-h-64 overflow-y-auto p-2">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const usageCount = usageByCategory[category.toLowerCase()] || 0
                const canDelete = usageCount === 0

                return (
                  <div
                    key={category}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-slate-50"
                  >
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => {
                        onChange(category)
                        setIsOpen(false)
                      }}
                    >
                      <span className="block truncate text-sm font-medium text-slate-800">
                        {category}
                      </span>

                      <span className="text-xs text-slate-400">
                        {usageCount === 0
                          ? "Saved tag"
                          : `${usageCount} transaction${usageCount === 1 ? "" : "s"}`}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
                        canDelete
                          ? "text-red-600 hover:bg-red-50"
                          : "cursor-not-allowed text-slate-300"
                      }`}
                      disabled={!canDelete}
                      title={
                        canDelete
                          ? "Delete tag"
                          : "Tags used by transactions cannot be deleted"
                      }
                      onClick={() => onDeleteTag(category)}
                    >
                      Delete
                    </button>
                  </div>
                )
              })
            ) : (
              <p className="px-3 py-4 text-sm text-slate-500">
                No matching tags yet.
              </p>
            )}
          </div>

          {normalizedValue && !categoryExists && (
            <div className="border-t border-slate-100 p-2">
              <button
                type="button"
                className="w-full rounded-lg bg-emerald-50 px-3 py-2 text-left text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                onClick={handleCreate}
              >
                Create "{normalizedValue}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TransactionForm({
  selectedTransaction,
  transactions = [],
  onTransactionSaved,
  onCancelEdit,
}) {
  const [amount, setAmount] = useState(
    selectedTransaction?.amount ? String(selectedTransaction.amount) : "",
  )
  const [type, setType] = useState(selectedTransaction?.transactionType || "")
  const [category, setCategory] = useState(selectedTransaction?.category || "")
  const [note, setNote] = useState(selectedTransaction?.note || "")
  const [date, setDate] = useState(
    formatDateInputValue(selectedTransaction?.date),
  )
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedCategories, setSavedCategories] = useState(readSavedCategories)

  const isEditing = Boolean(selectedTransaction)

  const rememberCategory = (newCategory) => {
    const normalized = normalizeCategory(newCategory)

    if (!normalized) {
      return
    }

    setSavedCategories((current) => {
      if (
        current.some(
          (categoryName) =>
            categoryName.toLowerCase() === normalized.toLowerCase(),
        )
      ) {
        return current
      }

      const nextCategories = [...current, normalized].sort((first, second) =>
        first.localeCompare(second),
      )
      saveCategories(nextCategories)
      return nextCategories
    })
  }

  const deleteCategory = (categoryToDelete) => {
    const inUse = transactions.some(
      (transaction) =>
        (transaction.category || "").toLowerCase() ===
        categoryToDelete.toLowerCase(),
    )

    if (inUse) {
      return
    }

    setSavedCategories((current) => {
      const nextCategories = current.filter(
        (categoryName) =>
          categoryName.toLowerCase() !== categoryToDelete.toLowerCase(),
      )
      saveCategories(nextCategories)
      return nextCategories
    })
  }

  const resetForm = () => {
    setAmount("")
    setType("")
    setCategory("")
    setNote("")
    setDate("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    const normalizedCategory = normalizeCategory(category)

    try {
      const payload = {
        amount: Number(amount),
        transactionType: type,
        category: normalizedCategory,
        note: note.trim(),
        ...(date ? { date } : {}),
      }

      if (isEditing) {
        await transactionApi.update(selectedTransaction._id, payload)
      } else {
        await transactionApi.create(payload)
      }

      rememberCategory(normalizedCategory)
      await onTransactionSaved()

      if (!isEditing) {
        resetForm()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
            {isEditing ? "Editing" : "New entry"}
          </p>

          <h2 className="text-2xl font-semibold text-slate-950">
            {isEditing ? "Edit Transaction" : "Add Transaction"}
          </h2>
        </div>

        {isEditing && (
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2"
      >
        <CategoryPicker
          value={category}
          onChange={setCategory}
          transactions={transactions}
          savedCategories={savedCategories}
          onCreateTag={rememberCategory}
          onDeleteTag={deleteCategory}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Amount
          </label>

          <input
            type="number"
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            min="1"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Type
          </label>

          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            value={type}
            onChange={(event) => setType(event.target.value)}
            required
          >
            <option value="">
              Select Type
            </option>

            <option value="income">
              Income
            </option>

            <option value="expense">
              Expense
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Date
          </label>

          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Note
          </label>

          <textarea
            placeholder="Add a short note"
            className="min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 md:col-span-2">
            {error}
          </p>
        )}

        <button
          className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 md:col-span-2"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditing
              ? "Saving..."
              : "Adding..."
            : isEditing
              ? "Save Changes"
              : "Add Transaction"}
        </button>
      </form>
    </div>
  )
}

export default TransactionForm
