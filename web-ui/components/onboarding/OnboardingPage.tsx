import {AccountForm} from '../user/AccountForm';
import {Typography} from 'antd';

export function OnboardingPage() {
  return <>
    <Typography.Title level={3}>Welcome to the Magic
      InvesTool</Typography.Title>
    <Typography.Paragraph style={{maxWidth: 800}}>
      To start using it, you are going to need two things:
      <ul>
        <li>
          Create an account at <a
          href={'https://www.magicformulainvesting.com/'}
          rel={'noreferrer noopener'}
          target={'_blank'}>
          https://www.magicformulainvesting.com/
        </a> and save your login and password to the Account Details here.
          The tool is going to use your credentials to fetch Magic Formula list.
        </li>
        <li>
          Create an account at <a
          href={'https://www.yahoofinanceapi.com/'}
          rel={'noreferrer noopener'}
          target={'_blank'}>
          https://www.yahoofinanceapi.com/
        </a> and save your API key to the Account Details here.
          The tool is going to use Yahoo Finance API to get financial data for
          the companies from the Magic Formula list to get better suggestions for you.
          <br/>
          <b>Note:</b> keep in mind that free usage plan of the Yahoo API have
          limited usage quota per day. So the tool will cache the data to
          reduce amount of calls. Choose how many hours are you comfortable with
          for caching. You can force-update individual company`&apos;s data anyway.
        </li>
      </ul>
    </Typography.Paragraph>
    <Typography.Paragraph>
      To change this data later go to the Settings section.
    </Typography.Paragraph>
    <AccountForm />
  </>;
}