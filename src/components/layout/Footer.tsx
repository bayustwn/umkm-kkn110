import { useUserInfo } from '@/hooks/useAuth';

interface FooterContactItem {
  icon: string;
  alt: string;
  value: string;
  iconClass: string;
}

export default function Footer() {
  const { data: userInfo, isLoading } = useUserInfo();

  const contacts: FooterContactItem[] = [
    {
      icon: '/icons/phone.svg',
      alt: 'phone',
      value: userInfo?.telp ?? '...',
      iconClass: 'w-7 md:w-8',
    },
    { icon: '/icons/email.svg', alt: 'email', value: userInfo?.email ?? '...', iconClass: 'w-6' },
    {
      icon: '/icons/instagram.svg',
      alt: 'instagram',
      value: userInfo?.instagram ?? '...',
      iconClass: 'w-7 md:w-8',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-5 mt-30 w-full justify-center items-center">
      {contacts.map((item) => (
        <div
          key={item.alt}
          className="flex cursor-pointer flex-row hover:scale-105 transition-all items-center gap-2"
        >
          <img src={item.icon} alt={item.alt} className={item.iconClass} />
          <p className="font-medium text-sm md:text-base">
            {isLoading ? 'Loading...' : item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
