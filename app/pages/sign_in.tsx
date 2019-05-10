/** @jsx jsx */
import Link from 'next/link'
import { jsx, css } from '@emotion/core'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import Layout from '../components/Layout'
import { Container } from 'sancho'
import { withRouter } from 'next/router'
import { Spinner, Button, InputGroup, Input, Divider, Text, Tabs, Tab } from 'sancho'
import { Formik, Field, Form, FieldProps } from 'formik'

const loginData = {
  email: '',
  password: ''
}

const SignIn = ({ book, router }: any) => {
  return (
    <Layout tab={router.query.tab}>
      <Container style={{
        maxWidth: 380,
        marginTop: 60
      }}>
        <Link href="/sign_up">
          <a>新規登録</a>
        </Link>
        <Text variant="h4" style={{
          textAlign: 'center'
        }}>ログイン</Text>
        <Formik initialValues={loginData} onSubmit={(values, actions) => {
        }} render={({ values, handleSubmit, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
          console.log(values)
          return <Form>
            <InputGroup label="メールアドレス *">
              <Field type="email" name="email" component={CustomInput} />
            </InputGroup>
            <InputGroup label="パスワード *">
              <>
                <Field type="password" name="password" component={CustomInput} />
                <p css={css`
                  font-size: 12px;
                  margin-top: 2px;
                  text-align: right;
                `}>パスワードをお忘れの方はこちら</p>
              </>
            </InputGroup>
            <Button component="button" style={{
              marginTop: 24,
              width: '100%'
            }}>ログイン</Button>
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
