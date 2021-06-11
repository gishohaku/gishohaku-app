/** @jsx jsx */
import firebase from 'firebase/app'
import { Button, InputGroup, Input, TextArea, Select, Text } from 'sancho'
import { jsx, css } from '@emotion/core'
import { Formik, Field, FieldProps } from 'formik'
import Circle, { categoriesByEvent, plans, CriclePlan } from '../utils/circle'
import ImageUploader from './ImageUploader'
import ImageBox from './ImageBox'
import { useContext } from 'react'
import EventContext from '../contexts/EventContext'

interface Props {
  onSubmit: (circle: Circle) => void
  user: firebase.User
  circle: Circle
}

const smallGray = css`
  display: block;
  color: #5f6871;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
`

const CircleForm = ({ onSubmit, user, circle }: Props) => {
  const { eventId } = useContext(EventContext)
  const categoryOptions = categoriesByEvent[eventId]
  return (
    <Formik
      initialValues={circle}
      onSubmit={(values) => {
        onSubmit(values)
      }}
      render={({
        values,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <InputGroup label="サークル名 *">
              <Field name="name" component={CustomInput} disabled />
            </InputGroup>
            <InputGroup
              label="サークル紹介"
              helpText="Markdownが使用可能です。">
              <Field name="description" component={CustomTextarea} rows={5} />
            </InputGroup>
            <InputGroup label="画像">
              <div
                css={css`
                  overflow-x: auto;
                  display: flex;
                  > div {
                    margin-right: 12px;
                  }
                `}>
                <div>
                  <Text css={smallGray}>カラー</Text>
                  {values.image ? (
                    <ImageBox
                      imageUrl={values.image}
                      size="circlecut"
                      width={180}
                      onClick={() => {
                        if (confirm('画像を削除しますか？')) {
                          setFieldValue('image', '')
                        }
                      }}
                    />
                  ) : (
                    <ImageUploader
                      user={user}
                      size="circlecut"
                      addUrl={(url: string) => {
                        setFieldValue('image', url)
                      }}
                    />
                  )}
                </div>
                <div>
                  <Text css={smallGray}>グレースケール</Text>
                  {values.imageMonochro ? (
                    <ImageBox
                      imageUrl={values.imageMonochro}
                      size="circlecut"
                      width={180}
                      onClick={() => {
                        if (confirm('画像を削除しますか？')) {
                          setFieldValue('imageMonochro', '')
                        }
                      }}
                    />
                  ) : (
                    <ImageUploader
                      user={user}
                      size="circlecut"
                      addUrl={(url: string) => {
                        setFieldValue('imageMonochro', url)
                      }}
                    />
                  )}
                </div>
              </div>
              <Text css={smallGray}>
                ※推奨サイズ: 横635px
                縦903px。最大1MBまで、jpg/gif/pngのいずれかの形式でアップロードしてください。
                <br />
                ※この画像はWebサイトのサークル一覧として表示されるほか、公式パンフレットのサークルカットとして印刷されます。
                <br />
                ※グレースケール版を登録されていない場合は、運営事務局にて自動変換いたします。
                <br />
                ※サークルカットのテンプレートは
                <a
                  target="_blank"
                  rel="noopener"
                  href="https://docs.circle.ms/howto/circlecut.html">
                  こちら
                </a>
                をお使い下さい。
              </Text>
            </InputGroup>
            <InputGroup label="プラン *">
              <Select
                name="plan"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.plan}
                disabled>
                <option>選択してください</option>
                {Object.keys(plans).map((key) => {
                  const planKey = key as CriclePlan
                  const label = plans[planKey]
                  return (
                    <option value={key} key={key}>
                      {label}
                    </option>
                  )
                })}
              </Select>
            </InputGroup>
            <InputGroup label="ジャンル">
              <Select
                name="category"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.category}>
                <option>選択してください</option>
                {Object.keys(categoryOptions).map((key) => {
                  const categoryKey = key as keyof typeof categoryOptions
                  const label = categoryOptions[categoryKey]
                  return (
                    <option value={key} key={key}>
                      {label}
                    </option>
                  )
                })}
              </Select>
            </InputGroup>
            <Button
              component="button"
              block
              intent="primary"
              style={{ marginTop: 32 }}
              loading={isSubmitting}>
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
    {touched[field.name] && errors[field.name] && (
      <div className="error">{errors[field.name]}</div>
    )}
  </div>
)

const CustomTextarea = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps<any>) => (
  <div>
    <TextArea {...field} {...props} />
    {touched[field.name] && errors[field.name] && (
      <div className="error">{errors[field.name]}</div>
    )}
  </div>
)

export default CircleForm
