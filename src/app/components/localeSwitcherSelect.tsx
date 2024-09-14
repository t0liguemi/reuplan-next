'use client';
import {useParams} from 'next/navigation';
import {type ReactNode, useTransition} from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '~/components/ui/select';
import {type Locale,usePathname, useRouter} from '~/i18n/routing';

type Props = {
  children: ReactNode;
  defaultValue: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(value:string) {
    const nextLocale = value as Locale;
    startTransition(() => {
        router.replace(pathname, { locale: nextLocale })
    });
  }

  return (
        <Select onValueChange={onSelectChange} disabled={isPending} defaultValue={defaultValue}>
          <SelectTrigger className="py-1 h-fit min-h-8 bg-background/40 text-sm md:px-2 px-1">
            <SelectValue className="max-h-fit px-1" />
          </SelectTrigger>
          <SelectContent className='bg-muted/40 backdrop-blur-lg text-sm'>{children}</SelectContent>
        </Select>
  );
}