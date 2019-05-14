/** @jsx jsx */
import { Button, InputGroup, Input, TextArea, Divider, Select, } from 'sancho'
import { jsx, css } from '@emotion/core'
import { Formik, Field, FieldProps } from 'formik'
import Circle, { categories, CricleCategory, plans, CriclePlan } from '../utils/circle'
import ImageUploader from './ImageUploader'
import ImageBox from './ImageBox';

interface Props {
  onSubmit: (circle: Circle) => void,
  user: firebase.User,
  circle: Circle
}

const CircleForm = ({ onSubmit, user, circle }: Props) => {
  return <Formik initialValues={circle} onSubmit={(values, actions) => {
    onSubmit(values)
  }} render={({ values, handleSubmit, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
    console.log(values)
    return <form onSubmit={handleSubmit}>
      <InputGroup label="サークル名 *">
        <Field name="name" component={CustomInput} disabled />
      </InputGroup>
      <InputGroup label="画像" helpText="推奨サイズ: 横635px 縦903px。最大1MBまで、jpg/gif/pngのいずれかの形式でアップロードしてください。">
        <div css={css`
          overflow-x: auto;
        `}>
          {
            values.image.length > 0 ?
              <ImageBox
                imageUrl={values.image}
                size='circlecut'
                onClick={() => {
                  if (confirm('画像を削除しますか？')) {
                    setFieldValue('image', '')
                  }
                }}
              /> : <ImageUploader user={user} addUrl={(url: string) => {
                setFieldValue('image', url)
              }} />
          }
        </div>
      </InputGroup>
      <InputGroup label="プラン *">
        <Select name="plan" onChange={handleChange} onBlur={handleBlur} value={values.plan} disabled>
          <option>選択してください</option>
          {
            Object.keys(plans).map((key) => {
              const planKey = key as CriclePlan
              const label = plans[planKey]
              return <option value={key} key={key}>{label}</option>
            })
          }
        </Select>
      </InputGroup>
      <InputGroup label="ジャンル">
        <Select name="category" onChange={handleChange} onBlur={handleBlur} value={values.category}>
          <option>選択してください</option>
          {
            Object.keys(categories).map((key) => {
              const categoryKey = key as CricleCategory
              const label = categories[categoryKey]
              return <option value={key} key={key}>{label}</option>
            })
          }
        </Select>
      </InputGroup>
      <Divider />
      <Button component="button" block intent="primary" loading={isSubmitting}>
        保存する
      </Button>
    </form>
  }} />
}

const CustomInput = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps<any>) => (
    <div>
      <Input type="text" {...field} {...props} />
      {touched[field.name] &&
        errors[field.name] && <div className="error">{errors[field.name]}</div>}
    </div>
  )

const CustomTextarea = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps<any>) => (
    <div>
      <TextArea {...field} {...props} />
      {touched[field.name] &&
        errors[field.name] && <div className="error">{errors[field.name]}</div>}
    </div>
  )

export default CircleForm