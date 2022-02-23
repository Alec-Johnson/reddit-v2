import Link from "next/link";

export default function NotFound() {
  return (
  <section className="flex flex-col items-center">
    <h1 className="mt-10 mb-4 text-5xl text-gray-800 dark:text-gray-200">
      404: Page not found
    </h1>
    
    <Link href='/'>
      <a className="flex flex-col items-center">
        <h2 className="mt-10 mb-4 text-2xl text-gray-800 dark:text-gray-200">
          Click here to navigate back to the home page
        </h2>
        <a className="px-4 py-2 blue button ">Home</a>
      </a>
    </Link>
  </section>
  )
}
