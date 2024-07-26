import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import { MoveUpRightIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col items-center justify-center text-center px-2 py-8">
      <Link
        href="https://westholmepark.com"
        target="_blank"
        className="mb-5 sm:text-lg flex items-center gap-2 underline underline-offset-4"
      >
        查看我们的英文网站{" "}
        <MoveUpRightIcon className="w-4 h-4 font-extrabold" />
      </Link>
      <h1 className="text-3xl font-bold mb-4 sm:text-7xl">
      仅限女生的UCLA学生宿舍，位于校园对面
      </h1>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
      我们的房产专为国际女学生提供服务——精美的家具，灵活的租赁条款，为学生而建。
      </p>
      <div className="flex flex-row items-center gap-5">
        <Link
          href={`/docs/${page_routes[0].href}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          联系我们
        </Link>
        <Link
          href="#"
          className={buttonVariants({
            variant: "outline",
            className: "px-6",
            size: "lg",
          })}
        >
          了解更多
        </Link>
      </div>
      <span className="flex flex-row items-center gap-2 text-zinc-400 text-md mt-7 -mb-12 max-[800px]:mb-12">
        <TerminalIcon className="w-4 h-4 mr-1" /> 在Westholme Park与我们一起生活
      </span>
    </div>
  );
}
