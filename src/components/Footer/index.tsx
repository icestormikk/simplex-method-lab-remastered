import { shell } from 'electron';

function Footer() {
  const openGithubAccount = async () => {
    shell.openExternal('https://github.com/icestormikk')
  }

  return (
    <footer className='centered w-full text-gray-400'>
      <span>Made by <a onClick={openGithubAccount}>@icestormikk</a>, 2023</span>
    </footer>
  );
}

export default Footer;