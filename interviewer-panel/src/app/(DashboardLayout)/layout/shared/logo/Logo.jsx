import { useSelector } from 'react-redux';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'block',
  }));

  if (customizer.activeDir === 'ltr') {
    return (
      <LinkStyled href="/">
        {customizer.activeMode === 'dark' ? (
          // <Image
          //   src="/images/logos/main-logo-dark.png"
          //   alt="logo"
          //   height={customizer.TopbarHeight}
          //   width={174}
          //   className="m-2 mt-4"
          //   priority
          // />
          <p className="font-extrabold mt-4 text-2xl bg-gradient-to-r from-[#45BAFF] to-[#45BAFF] bg-clip-text text-transparent">
            CheckMailPro
          </p>
        ) : (
          // <Image
          //   src={'/images/logos/main-logo-dark.png'}
          //   alt="logo"
          //   height={customizer.TopbarHeight}
          //   width={174}
          //   priority
          // />
          <p className="font-extrabold mt-4 text-2xl bg-gradient-to-r from-[#45BAFF] to-[#45BAFF] bg-clip-text text-transparent">
            CheckMailPro
          </p>
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/">
      {customizer.activeMode === 'dark' ? (
        // <Image
        //   src="/images/logos/main-logo-dark.png.png"
        //   alt="logo"
        //   height={customizer.TopbarHeight}
        //   width={174}
        //   priority
        // />
        <p className="font-extrabold text-2xl  mt-4 bg-gradient-to-r from-[#45BAFF] to-[#45BAFF] bg-clip-text text-transparent">
          CheckMailPro
        </p>
      ) : (
        // <Image
        //   src="/images/logos/main-logo-dark.png"
        //   alt="logo"
        //   height={customizer.TopbarHeight}
        //   width={174}
        //   priority
        // />
        <p className="font-extrabold text-2xl mt-4 bg-gradient-to-r from-[#45BAFF] to-[#45BAFF] bg-clip-text text-transparent">
          CheckMailPro
        </p>
      )}
    </LinkStyled>
  );
};

export default Logo;
