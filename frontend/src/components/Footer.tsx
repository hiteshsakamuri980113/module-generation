interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  return (
    <footer
      className={`h-[72px] gap-[10px] opacity-100 py-6 px-[72px] ${className}`}
    >
      <p className="font-inter font-normal text-[14px] leading-[24px] tracking-[0%] text-accent">
        © Kartik Team, 2025.
      </p>
    </footer>
  );
};

export default Footer;
