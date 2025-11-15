'use client';

import Select from 'react-select';
import { Controller } from 'react-hook-form';
import { Book } from '@/app/(protected)/books/_types';
import { STATUS_OPTIONS, RATING_OPTIONS } from '@/app/(protected)/books/_constants';
import AuthorModal from '@/app/(protected)/authors/_components/modal';
import CategoryModal from '@/app/(protected)/categories/_components/modal';
import FormInput from '@/components/forms/FormInput';
import FormCheckbox from '@/components/forms/FormCheckbox';
import FormTextarea from '@/components/forms/FormTextarea';
import FormSelect from '@/components/forms/FormSelect';
import Button from '@/components/buttons/Button';
import { useBookForm } from '@/app/(protected)/books/_hooks/useBookForm';
import { useModal } from '@/hooks/useModal';
import { useAuthors } from '@/app/(protected)/authors/_hooks/useAuthors';
import { useCategories } from '@/app/(protected)/categories/_hooks/useCategories';

// TODO: Tag機能を実装したらTag型をimportする
interface BookFormProps {
  book?: Book;
  submitLabel: string;
  cancel: () => void;
}

// TODO: Tag機能を実装したらTagsを追加する
export default function BookForm({ book, submitLabel, cancel }: BookFormProps) {
  const { data: authors } = useAuthors();
  const { data: categories } = useCategories();
  const { register, control, handleSubmit, errors, onSubmit, isSubmitting } = useBookForm({
    book,
    cancel,
  });
  const authorModal = useModal();
  const categoryModal = useModal();

  return (
    <>
      <form
        className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* タイトル */}
          <FormInput
            name="title"
            label="タイトル"
            type="text"
            placeholder="タイトルを入力"
            error={errors.title?.message}
            register={register}
          />
          {/* 著者 */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <label htmlFor="book-authors" className="font-semibold text-gray-700">
                著者
              </label>
              <button
                type="button"
                onClick={authorModal.open}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + 著者を追加
              </button>
            </div>
            <Controller
              name="author_ids"
              control={control}
              render={({ field: { onChange, value, ref } }) => {
                const options = (authors || []).map((a) => ({
                  value: a.id,
                  label: a.name,
                }));
                return (
                  <Select
                    ref={ref}
                    instanceId="book-authors"
                    inputId="book-authors"
                    isMulti
                    options={options}
                    value={options.filter((c) => value?.includes(c.value))}
                    onChange={(val) => onChange(val.map((c) => c.value))}
                    placeholder="著者を検索・選択"
                    className="text-sm"
                  />
                );
              }}
            />
            {errors.author_ids && (
              <p className="mt-1 text-sm text-red-600">{errors.author_ids.message}</p>
            )}
          </div>
          {/* ステータス */}
          <FormSelect
            name="reading_status"
            label="ステータス"
            options={STATUS_OPTIONS}
            error={errors.reading_status?.message}
            register={register}
          />
          {/* 評価 */}
          <FormSelect
            name="rating"
            label="評価 (1-5)"
            options={RATING_OPTIONS}
            defaultValue=""
            defaultLabel="未評価"
            error={errors.rating?.message}
            register={register}
            registerOptions={{
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            }}
          />
        </div>

        {/* 説明 */}
        <FormTextarea
          name="description"
          label="説明"
          placeholder="書籍の説明やメモを入力"
          error={errors.description?.message}
          register={register}
        />

        {/* カテゴリ */}
        <FormSelect
          name="category_id"
          label="カテゴリ"
          options={(categories || []).map((c) => ({ value: c.id, label: c.name }))}
          defaultValue=""
          defaultLabel="未分類"
          error={errors.category_id?.message}
          register={register}
          registerOptions={{
            setValueAs: (v) => (v === '' ? undefined : Number(v)),
          }}
          button={
            <button
              type="button"
              onClick={categoryModal.open}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + カテゴリを追加
            </button>
          }
        />

        {/* 公開・非公開 */}
        <FormCheckbox
          name="public"
          label="公開する"
          error={errors.public?.message}
          register={register}
        />

        <div className="flex justify-end gap-3">
          <Button variant="cancel" onClick={cancel}>
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="submit"
            disabled={isSubmitting}
            loadingLabel={`${submitLabel}中...`}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
      {/* モーダル */}
      <AuthorModal isOpen={authorModal.isOpen} onClose={authorModal.close} />
      <CategoryModal isOpen={categoryModal.isOpen} onClose={categoryModal.close} />
    </>
  );
}
