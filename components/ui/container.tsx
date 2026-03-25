import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Container({ children, className = "", id }: ContainerProps) {
  return (
    <section id={id} className="section-shell px-4 sm:px-8 lg:px-12">
      <div className={`mx-auto w-full max-w-[1600px] ${className}`}>{children}</div>
    </section>
  );
}
