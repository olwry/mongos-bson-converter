'use client';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import { Tabs } from '@/components/ui/tabs';
import { TITLE } from '@/constants';
import { cn } from '@/lib/utils';
import {
  transformGoToMongoShell,
  transformToBsonGo,
} from '@/package/bson-mongos-converter';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import MongoSvg from '@/assets/mongo-bw.svg';
import BsonSvg from '@/assets/bson.svg';
import ThemeSwitchButton from '@/components/ThemeSwitchButton';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const transformers = {
  bson: transformToBsonGo,
  mongos: transformGoToMongoShell,
};

const transformerKeys = Object.keys(transformers);

export default function Home() {
  const [value, setValue] = useState<string | undefined>('{}');
  const [error, setError] = useState('');
  const lastValidValueRef = useRef<string>();
  const [srcTransformType, setSrcTransformType] =
    useState<keyof typeof transformers>('mongos');
  const [dstTransformType, setDstTransformType] =
    useState<keyof typeof transformers>('bson');
  const transformer = useMemo(
    () => transformers[dstTransformType],
    [dstTransformType]
  );
  const transformedValue = useMemo(() => {
    try {
      const transformed = transformer(value ?? '{}');
      setError('');
      lastValidValueRef.current = transformed;
      return transformed;
    } catch (err: any) {
      setError(err?.message);
      return value;
    }
  }, [transformer, value]);
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen gap-16 py-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col w-2/4 min-w-[800px] gap-8 items-center sm:items-start mt-[16vh]">
        <div className="flex w-full min-h-[360px] h-[42vh] gap-4">
          <div className="flex-1 flex flex-col">
            <TransformTypeSelection
              value={srcTransformType}
              onChange={(val) => {
                if (val === dstTransformType) {
                  setDstTransformType(
                    transformerKeys.find((k) => k !== val) as any
                  );
                }
                setValue(transformedValue);
                return setSrcTransformType(val);
              }}
            />
            <Editor
              focusOnLoad
              defaultLanguage={
                srcTransformType === 'bson' ? 'go' : 'javascript'
              }
              language={srcTransformType === 'bson' ? 'go' : 'javascript'}
              onChange={(val) => {
                setValue(val);
              }}
              value={value}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex justify-end w-full">
              <TransformTypeSelection
                value={dstTransformType}
                onChange={(val) => {
                  if (val === srcTransformType) {
                    setSrcTransformType(
                      transformerKeys.find((k) => k !== val) as any
                    );
                  }
                  setValue(transformedValue);
                  return setDstTransformType(val);
                }}
              />
            </div>
            <Preview
              value={error ? lastValidValueRef.current : transformedValue}
              className={error ? '[&>div]:opacity-40' : ''}
            />
          </div>
        </div>
        <div className={cn('text-red-500 text-sm', error ? '' : 'opacity-0')}>
          {error || '-'}
        </div>
        <div className="text-center w-full font-[family-name:var(--font-geist-mono)] mt-6 text-2xl">
          {TITLE}
        </div>
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}
        {/* <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{' '}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol> */}

        {/* <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div> */}
      </main>
      <div className="flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-neutral-400 hover:text-neutral-200 transition-colors"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          /> */}
          Why?
        </a>
        {/* <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a> */}
      </div>
      <div className="flex-1"></div>
      <footer className="flex justify-end w-full md:px-12 px-6 gap-4">
        <ThemeSwitchButton />
        <Button asChild className="p-3 h-11 w-11" variant="ghost">
          <Link
            href="https://github.com/olry/mongos-bson-query-converter"
            target="_blank"
            rel="noopener"
          >
            <GitHubLogoIcon className="size-full" />
          </Link>
        </Button>
      </footer>
    </div>
  );
}

function TransformTypeSelection<T extends string = keyof typeof transformers>({
  value,
  onChange,
}: {
  value: T;
  onChange(val: T): void;
}) {
  return (
    <Tabs
      className="w-fit mb-2"
      onValueChange={(val) => {
        onChange(val as any);
      }}
      value={value}
    >
      <Tabs.List className="grid w-full grid-cols-2">
        <Tabs.Trigger value="mongos">
          <Image src={MongoSvg} width={18} height={18} alt="mongo icon" />
          mongosh
        </Tabs.Trigger>
        <Tabs.Trigger value="bson">
          <span className="text-white">
            <Image src={BsonSvg} width={18} height={18} alt="BSON icon" />
          </span>
          BSON
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  );
}
