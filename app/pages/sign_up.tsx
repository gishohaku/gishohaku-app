/** @jsx jsx */
import Link from 'next/link'
import { jsx, css } from '@emotion/core'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import Layout from '../components/Layout'
import { Container } from 'sancho'
import { withRouter } from 'next/router'
import { Spinner, Button, InputGroup, Input, Divider, Text, useToast } from 'sancho'
import { Formik, Field, Form, FieldProps, ErrorMessage } from 'formik'

const loginData = {
  email: '',
  password: ''
}

const SignIn = ({ book, router }: any) => {
  const toast = useToast()

  return (
    <Layout tab={router.query.tab}>
      <Container style={{
        maxWidth: 380,
        marginTop: 60
      }}>
        <Link href="/sign_in">
          <a>ログイン</a>
        </Link>
        <Text variant="h4" style={{
          textAlign: 'center'
        }}>新規登録</Text>
        <Formik initialValues={loginData} onSubmit={(values, actions) => {
          const { email, password } = values
          firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(res => {
              toast({
                title: '会員登録が完了しました',
                intent: 'success'
              })
              console.log(res)
              router.push('/')
            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              switch(error.code) {
                case 'auth/invalid-email':
                  break;
                case 'auth/email-already-in-use':
                  actions.setFieldError('email', '既に登録済みのアドレスです')
                  break;
                case 'auth/weak-password':
                  actions.setFieldError('email', '既に登録済みのアドレスです')
                  break;
                default:
                  // 不明のエラー的な
              }
              console.log(error)
              actions.setSubmitting(false)
            })
        }} render={({ values, handleSubmit, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
          console.log(values)
          return <Form>
            <InputGroup label="メールアドレス *">
              <Field type="email" name="email" component={CustomInput} />
            </InputGroup>
            <InputGroup label="パスワード *">
              <Field type="password" name="password" component={CustomInput} />
            </InputGroup>
            <p css={css`
              font-size: 12px;
              margin-top: 24px;
            `}>登録することで、利用規約/プライバシーポリシーに同意するものとします</p>
            <Button component="button" loading={isSubmitting} style={{
              marginTop: 8,
              width: '100%'
            }}>登録する</Button>
          </Form>
        }} />
        <Divider />
        <Text variant="h6" muted>ソーシャルアカウントで登録・ログイン</Text>
        <Button component="button">Google</Button>
        <Button component="button">GitHub</Button>
        <Button component="button">Twitter</Button>
        <p css={css`
          font-size: 12px;
          margin-top: 2px;
        `}>登録することで、利用規約/プライバシーポリシーに同意するものとします</p>
      </Container>
    </Layout>
  )
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

export default withRouter(SignIn)
