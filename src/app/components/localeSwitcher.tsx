import {useLocale, useTranslations} from 'next-intl';
import LocaleSwitcherSelect from './localeSwitcherSelect';
import {routing} from '~/i18n/routing';
import { SelectItem } from '~/components/ui/select';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale}>
      {routing.locales.map((cur) => (
        <SelectItem key={cur} value={cur} className='text-md font-light'>
          {t('locale', {locale: cur})}
        </SelectItem>
      ))}
    </LocaleSwitcherSelect>
  );
}