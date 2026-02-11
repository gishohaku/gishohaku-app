/** @jsx jsx */
import Link from 'next/link'
import { useState } from 'react'
import { jsx, css, Global } from '@emotion/react'
import firebase from 'firebase/app'
import SectionHeader from '../components/gishohaku1/SectionHeader'
import { Container } from '../components/common/Container'
import { NextRouter, useRouter } from 'next/router'
import { Button, InputGroup, Input, Text, Alert } from 'sancho'
import { Formik, Field, Form, FieldProps } from 'formik'
import { NextPage } from 'next'
import { REDIRECT_TO_AFTER_LOGIN } from '../withUser'
import { useToast } from '../components/Toast'

const loginData = {
  email: '',
  password: '',
}

export const redirectAfterLogin = (router: NextRouter) => {
  const afterLoginPath = localStorage.getItem(REDIRECT_TO_AFTER_LOGIN)
  localStorage.removeItem(REDIRECT_TO_AFTER_LOGIN)
  router.push(afterLoginPath || '/')
}

const SignIn: NextPage = () => {
  const toast = useToast()
  const router = useRouter()
  const [error, setError] = useState('')
  return (
    <>
      <Global
        styles={{
          body: {
            backgroundColor: 'white',
          },
        }}
      />
      <Container
        css={css`
          max-width: 380px;
          padding-top: 60px;
        `}>
        <SectionHeader text="LOGIN">ログイン</SectionHeader>
        <Formik
          initialValues={loginData}
          onSubmit={(values, actions) => {
            const { email, password } = values
            firebase
              .auth()
              .signInWithEmailAndPassword(email, password)
              .then(() => {
                redirectAfterLogin(router)
                toast({
                  title: 'ログインしました',
                  intent: 'success',
                })
              })
              .catch((error: any) => {
                switch (error.code) {
                  case 'auth/wrong-password':
                  case 'auth/user-not-found':
                    setError('メールアドレスまたはパスワードが違います')
                    break
                  default:
                    setError(
                      `エラーが発生しました。運営事務局までご連絡ください。: ${error.message}`,
                    )
                }
                console.log(error)
                actions.setSubmitting(false)
              })
          }}
          render={() => {
            return (
              <Form>
                {error && <Alert intent="danger" title={error} />}
                {/* SSR時のfirst-child対応 */}
                <div />
                <InputGroup label="メールアドレス *">
                  <Field type="email" name="email" component={CustomInput} />
                </InputGroup>
                <InputGroup label="パスワード *">
                  <>
                    <Field
                      type="password"
                      name="password"
                      component={CustomInput}
                    />
                    <div
                      css={css`
                        text-align: right;
                      `}>
                      <Link href="/reset_password"
                        css={css`
                          font-size: 12px;
                          margin-top: 2px;
                        `}>
                        パスワードをお忘れの方はこちら
                      </Link>
                    </div>
                  </>
                </InputGroup>
                <Button
                  intent="primary"
                  component="button"
                  style={{
                    marginTop: 24,
                    width: '100%',
                  }}>
                  ログイン
                </Button>
              </Form>
            )
          }}
        />
        <Text variant="h6" muted style={{ marginTop: 32 }}>
          ソーシャルアカウントで登録・ログイン
        </Text>
        <Button
          component="button"
          onClick={async () => {
            await firebase
              .auth()
              .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            redirectAfterLogin(router)
            toast({
              title: 'ログインしました',
              intent: 'success',
            })
          }}>
          Google
        </Button>
        <Button
          component="button"
          onClick={async () => {
            await firebase
              .auth()
              .signInWithPopup(new firebase.auth.GithubAuthProvider())
            redirectAfterLogin(router)
            toast({
              title: 'ログインしました',
              intent: 'success',
            })
          }}>
          GitHub
        </Button>
        <p
          css={css`
            font-size: 12px;
            margin-top: 2px;
            line-height: 1.5;
            margin-bottom: 32px;
          `}>
          登録することで、
          <Link href="/gishohaku1/privacy">利用規約/プライバシーポリシー</Link>
          に同意するものとします
        </p>
        <Link href="/sign_up" legacyBehavior>
          <Button component="a" block variant="outline">
            会員登録はこちら
          </Button>
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
    {touched[field.name] && errors[field.name] && (
      <div className="error">{errors[field.name]}</div>
    )}
  </div>
)

export default SignIn
