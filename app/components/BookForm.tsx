import {
  Button,
  InputGroup,
  Input,
  TextArea,
  Divider,
  Select,
  Check
} from 'sancho'
import { Formik, Field, FieldProps } from 'formik'
import { Book } from '../utils/firebase'

interface Props {
  onSubmit: (book: Book) => void,
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
  medium: null,
  sampleUrl: '',
  purchaseUrl: '',
}

const BookForm = ({ onSubmit, book: initialBook }: Props) => {
  return <Formik initialValues={initialBook || initialState} onSubmit={(values, actions) => {
    onSubmit(values)
  }} render={({ values, handleSubmit, handleChange, handleBlur }) => {
    console.log(values)
    return <form onSubmit={handleSubmit}>
      <InputGroup label="タイトル">
        <Field name="title" component={CustomInput} />
      </InputGroup>
      <InputGroup label="価格">
        <Field name="price" type='number' component={CustomInput} />
      </InputGroup>
      <InputGroup label="種別">
        <>
          <Check onChange={handleChange} type="radio" name="type" label="同人誌" value='fanzine' checked={values.type === 'fanzine'} />
          <Check onChange={handleChange} type="radio" name="type" label="商業誌" value='commerce' checked={values.type === 'commerce'} />
        </>
      </InputGroup>
      <InputGroup label="頒布予定数">
        <Field name="stock" type='number' component={CustomInput} />
      </InputGroup>
      <InputGroup label="ページ数">
        <Field name="pages" type='number' component={CustomInput} />
      </InputGroup>
      <InputGroup label="媒体">
        <Select name="medium" onChange={handleChange} onBlur={handleBlur}>
          <option>選択してください</option>
          <option value="degital">電子媒体</option>
          <option value="paper">紙媒体</option>
          <option value="both">両方</option>
        </Select>
      </InputGroup>
      <InputGroup label="説明">
        <Field name="description" component={CustomTextarea} />
      </InputGroup>
      <InputGroup label="見本誌URL">
        <Field name="sampleUrl" component={CustomInput} />
      </InputGroup>
      <InputGroup label="購入URL">
        <Field name="purchaseUrl" component={CustomInput} />
      </InputGroup>
      <InputGroup label="新刊">
        <>
          <Check onChange={handleChange} name="isNew" label="新刊の場合チェック" value='true' checked={values.isNew} />
        </>
      </InputGroup>
      <Divider />
      <Button block intent="primary">
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

export default BookForm