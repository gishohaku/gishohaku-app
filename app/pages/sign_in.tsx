/** @jsx jsx */
import Link from 'next/link'
import { useState } from 'react'
import { jsx, css } from '@emotion/core'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import SectionHeader from '../components/atoms/SectionHeader'
import { Container } from 'sancho'
import { withRouter } from 'next/router'
import { Spinner, Button, InputGroup, Input, Divider, Text, Tabs, Tab, Alert, useToast } from 'sancho'
import { Formik, Field, Form, FieldProps } from 'formik'

const loginData = {
  email: '',
  password: ''
}

const SignIn = ({ book, router }: any) => {
  const toast = useToast()
  const [error, setError] = useState('')
  return (
    <>
      <Container style={{
        maxWidth: 380,
        paddingTop: 60
      }}>
        <SectionHeader text="LOGIN">ログイン</SectionHeader>
        <Formik initialValues={loginData} onSubmit={(values, actions) => {
          const { email, password } = values
          firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
              router.push('/')
              toast({
                title: 'ログインしました',
                intent: 'success'
              })
            })
            .catch((error) => {
              switch (error.code) {
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                  setError('メールアドレスまたはパスワードが違います')
                  break;
                default:
                  setError(`エラーが発生しました。運営事務局までご連絡ください。: ${error.message}`)
              }
              console.log(error)
              actions.setSubmitting(false)
            });
        }} render={({ values, errors, handleSubmit, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
          console.log(values)
          return <Form>
            {error && <Alert intent="danger" title={error} />}
            {/* SSR時のfirst-child対応 */}
            <div />
            <InputGroup label="メールアドレス *">
              <Field type="email" name="email" component={CustomInput} />
            </InputGroup>
            <InputGroup label="パスワード *">
              <>
                <Field type="password" name="password" component={CustomInput} />
                <div css={css`
                  text-align: right;
                `}>
                  <Link href="/reset_password" passHref>
                    <a css={css`
                      font-size: 12px;
                      margin-top: 2px;
                    `}>パスワードをお忘れの方はこちら</a>
                  </Link>
                </div>
              </>
            </InputGroup>
            <Button intent="primary" component="button" style={{
              marginTop: 24,
              width: '100%'
            }}>ログイン</Button>
          </Form>
        }} />
        <Divider />
        <Text variant="h6" muted>ソーシャルアカウントで登録・ログイン</Text>
        <Button component="button" onClick={() => {
          firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function (result) {
            router.push('/')
            toast({
              title: 'ログインしました',
              intent: 'success'
            })
          })
        }}>Google</Button>
        <Button component="button" onClick={() => {
          firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).then(function (result) {
            router.push('/')
            toast({
              title: 'ログインしました',
              intent: 'success'
            })
          })
        }}>GitHub</Button>
        <p css={css`
          font-size: 12px;
          margin-top: 2px;
        `}>登録することで、利用規約/プライバシーポリシーに同意するものとします</p>
        <Link href="/sign_up">
          <a>新規登録</a>
        </Link>
      </Container>
    </>
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
