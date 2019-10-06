/** @jsx jsx */
import { Button, InputGroup, Input, TextArea, Divider, Select, Check } from 'sancho'
import { jsx, css } from '@emotion/core'
import { Formik, Field, FieldProps } from 'formik'
import Book, { types, mediums, BookMedium, BookType } from '../utils/book'
import ImageUploader from './ImageUploader'
import ImageBox from './ImageBox'

interface Props {
  onSubmit: (book: Book) => void
  user: firebase.User
  book?: Book
}

const initialState: Book = {
  title: '',
  description: '',
  price: 0,
  stock: 0,
  pages: 0,
  images: [],
  type: 'fanzine',
  isNew: false,
  medium: '',
  sampleUrl: '',
  purchaseUrl: '',
  eventId: 'gishohaku1'
}

const BookForm = ({ onSubmit, user, book: initialBook }: Props) => {
  return (
    <Formik
      initialValues={initialBook || initialState}
      onSubmit={values => {
        onSubmit(values)
      }}
      render={({ values, handleSubmit, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <InputGroup label="タイトル *">
              <Field name="title" component={CustomInput} />
            </InputGroup>
            <InputGroup
              label="画像"
              helpText="画像は最大1MB/4枚まで、jpg/gif/pngのいずれかの形式でアップロードしてください。"
            >
              <div
                css={css`
                  overflow-x: auto;
                `}
              >
                <div
                  css={css`
                    display: flex;
                  `}
                >
                  {values.images &&
                    values.images.map((imageUrl, index) => {
                      return (
                        <ImageBox
                          imageUrl={imageUrl}
                          size="square"
                          width={180}
                          onClick={() => {
                            if (confirm('画像を削除しますか？')) {
                              setFieldValue('images', values.images.filter((_, i) => i != index))
                            }
                          }}
                          key={index}
                        />
                      )
                    })}
                  {values.images.length < 4 && (
                    <ImageUploader
                      user={user}
                      addUrl={(url: string) => {
                        setFieldValue('images', [...values.images, url])
                      }}
                    />
                  )}
                </div>
              </div>
            </InputGroup>
            <InputGroup label="価格">
              <Field name="price" type="number" component={CustomInput} />
            </InputGroup>
            <InputGroup label="種別 *">
              <>
                {Object.keys(types).map(key => {
                  const typeKey = key as BookType
                  const label = types[typeKey]
                  return (
                    <Check
                      onChange={handleChange}
                      type="radio"
                      name="type"
                      label={label}
                      value={key}
                      key={key}
                      checked={values.type === key}
                    />
                  )
                })}
              </>
            </InputGroup>
            <InputGroup
              label="頒布予定数"
              helpText="頒布数は公開されますが、空欄でも問題ありません。"
            >
              <Field name="stock" type="number" component={CustomInput} />
            </InputGroup>
            <InputGroup label="ページ数">
              <Field name="pages" type="number" component={CustomInput} />
            </InputGroup>
            <InputGroup label="媒体">
              <Select
                name="medium"
                onChange={handleChange}
                onBlur={handleBlur}
                // @ts-ignore
                value={values.medium}
              >
                <option>選択してください</option>
                {Object.keys(mediums).map(key => {
                  const mediumKey = key as BookMedium
                  const label = mediums[mediumKey]
                  return (
                    <option value={key} key={key}>
                      {label}
                    </option>
                  )
                })}
              </Select>
            </InputGroup>
            <InputGroup label="説明">
              <Field name="description" component={CustomTextarea} rows={5} />
            </InputGroup>
            <InputGroup
              label="立ち読みURL"
              helpText="外部サイトで読者向けに用意している場合入力してください。"
            >
              <Field name="sampleUrl" component={CustomInput} />
            </InputGroup>
            <InputGroup
              label="電子版購入URL"
              helpText="電子版の購入/ダウンロードURLが決まっている場合入力してください。"
            >
              <Field name="purchaseUrl" component={CustomInput} />
            </InputGroup>
            <InputGroup label="新刊">
              <>
                <Check
                  onChange={handleChange}
                  name="isNew"
                  label="新刊の場合チェックしてください"
                  value="true"
                  checked={values.isNew}
                />
              </>
            </InputGroup>
            <Divider />
            <Button component="button" block intent="primary" loading={isSubmitting}>
              保存する
            </Button>
          </form>
        )
      }}
    />
  )
}

const CustomInput = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps<any>) => (
  <div>
    <Input type="text" {...field} {...props} />
    {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
)

const CustomTextarea = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps<any>) => (
  <div>
    <TextArea {...field} {...props} />
    {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
)

export default BookForm
