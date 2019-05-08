/** @jsx jsx */
import {
  Button,
  InputGroup,
  Input,
  TextArea,
  Divider,
  Select,
  Check
} from 'sancho'
import { jsx, css } from '@emotion/core'
import { Formik, Field, FieldProps } from 'formik'
import { Book } from '../utils/firebase'
import ImageUploader from './ImageUploader'

interface Props {
  onSubmit: (circle: Circle) => void,
  user: firebase.User,
  circle: Circle
}

type CricleCategory = 'software/frontend' | 'software/backend' | 'software/etc' | 'software/ml' | 'software/low-layer' | 'infra' | 'hardware' | 'etc'

interface Circle {
  name: string
  nameKana: string
  image: string
  category: CricleCategory
  // 通常サークル / 倍量サークル
  plan: 'normal' | 'premium'
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
      <InputGroup label="画像" helpText="画像は最大1MBまで、jpg/gif/pngのいずれかの形式でアップロードしてください。">
        <div css={css`
        overflow-x: auto;
        `}>
          {
            values.image.length > 0 ?
              <span css={css`
                min-width: 180px;
                width: 180px;
                height: 180px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #ddd;
                margin-right: 8px;
            `}
                onClick={() => {
                  if (confirm('画像を削除しますか？')) {
                    setFieldValue('image', '')
                  }
                }}
              >
                <img src={values.image} />
            </span> :
            <ImageUploader user={user} addUrl={(url: string) => {
              setFieldValue('images', url)
            }} />
          }
        </div>
      </InputGroup>
      <InputGroup label="プラン *">
        <Select name="plan" onChange={handleChange} onBlur={handleBlur} value={values.plan} disabled>
          <option>選択してください</option>
          <option value="normal">通常プラン</option>
          <option value="premium">倍量プラン</option>
        </Select>
      </InputGroup>
      <InputGroup label="ジャンル">
        <Select name="category" onChange={handleChange} onBlur={handleBlur} value={values.category}>
          <option>選択してください</option>
          <option value="software/frontend">ソフトウェア/フロントエンド</option>
        </Select>
      </InputGroup>
      <Divider />
      <Button block intent="primary" loading={isSubmitting}>
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