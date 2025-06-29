import {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import styles from '@/app/styles/components/OrderModal.module.scss';
import {escapeHtml} from '@/app/lib/utils';
import {sendTelegramMessage} from "@/app/lib/telegram";

interface FormData {
    name: string;
    slackId: string;
    product: string;
    size: string;
    comment: string;
}

export default function OrderModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors}
    } = useForm<FormData>();

    // Function to open the modal
    const openModal = (productName: string) => {
        setIsOpen(true);
        // Set product value from the button's data-product attribute
        setValue('product', productName || 'Толстовка "Team Edition"');
    };

    // Function to close the modal
    const closeModal = () => {
        setIsOpen(false);
        reset();
        setSubmitStatus('idle');
        setErrorMessage('');
    };

    // Add event listener to open modal when clicking on order buttons
    useEffect(() => {
        // Use event delegation to handle clicks on order buttons
        const handleDocumentClick = (event: Event) => {
            const target = event.target as HTMLElement;
            // Check if the clicked element or any of its parents has the 'order-button' class
            const orderButton = target.closest('.order-button');
            if (orderButton) {
                const productName = orderButton.getAttribute('data-product') || '';
                openModal(productName);
            }
        };

        // Add click event listener to the document
        document.addEventListener('click', handleDocumentClick);

        // Clean up event listener when component unmounts
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [openModal]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            // Format the message for Telegram
            const {name, slackId, product, size, comment} = data;

            const message = `
<b>🛍 Новая заявка на мерч</b>

👤 <b>Имя:</b> ${escapeHtml(name)}
💬 <b>Slack ID:</b> ${escapeHtml(slackId)}
📦 <b>Товар:</b> ${escapeHtml(product)}
📏 <b>Размер:</b> ${escapeHtml(size)}
📝 <b>Комментарий:</b> ${comment ? escapeHtml(comment) : '—'}
      `.trim();

            // Send to Telegram via API
            const response = await sendTelegramMessage(message);

            if (!response) {
                throw new Error('Failed to send order to Telegram');
            }

            setSubmitStatus('success');
            reset();
            closeModal();

        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`${styles.order_modal} ${isOpen ? '' : styles['order_modal--hidden']}`}>
            <div className={styles.order_modal__content}>
                <div className={styles.order_modal__body}>
                    <div className={styles.order_modal__header}>
                        <h2 className={styles.order_modal__title}>Place Your Order</h2>
                        <button
                            type="button"
                            className={styles.order_modal__close_button}
                            onClick={closeModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {submitStatus === 'success' ? (
                        <div className={styles.order_modal__success_message}>
                            <svg className={styles.order_modal__success_icon} fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"></path>
                            </svg>
                            <p>Your order has been submitted successfully! We&apos;ll contact you shortly.</p>
                        </div>
                    ) : submitStatus === 'error' ? (
                        <div className={styles.order_modal__error_message}>
                            <svg className={styles.order_modal__error_icon} fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"></path>
                            </svg>
                            <p>{errorMessage || 'An error occurred. Please try again.'}</p>
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.order_modal__form}>
                        <div className="form__group">
                            <label htmlFor="name" className="form__label">Name</label>
                            <input
                                id="name"
                                type="text"
                                className={`form__input ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="Your name"
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters'
                                    }
                                })}
                            />
                            {errors.name && (
                                <p className="form__error">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="form__group">
                            <label htmlFor="slackId" className="form__label">Slack ID</label>
                            <input
                                id="slackId"
                                type="text"
                                className={`form__input ${errors.slackId ? 'border-red-500' : ''}`}
                                placeholder="Your Slack ID (e.g. @username)"
                                {...register('slackId', {
                                    required: 'Slack ID is required',
                                    pattern: {
                                        value: /^@[a-zA-Z0-9._-]+$/,
                                        message: 'Please enter a valid Slack ID (e.g. @username)'
                                    }
                                })}
                            />
                            {errors.slackId && (
                                <p className="form__error">{errors.slackId.message}</p>
                            )}
                        </div>

                        <div className="form__group">
                            <label htmlFor="size" className="form__label">Size</label>
                            <select
                                id="size"
                                className={`form__select ${errors.size ? 'border-red-500' : ''}`}
                                {...register('size', {
                                    required: 'Size is required'
                                })}
                            >
                                <option value="">Select a size</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                            {errors.size && (
                                <p className="form__error">{errors.size.message}</p>
                            )}
                        </div>

                        <div className="form__group">
                            <label htmlFor="product" className="form__label">Product</label>
                            <input
                                id="product"
                                type="text"
                                className={`form__input ${errors.product ? 'border-red-500' : ''}`}
                                placeholder="Product name"
                                readOnly
                                {...register('product', {required: 'Product is required'})}
                            />
                            {errors.product && (
                                <p className="form__error">{errors.product.message}</p>
                            )}
                        </div>

                        <div className="form__group">
                            <label htmlFor="comment" className="form__label">Comment (Optional)</label>
                            <textarea
                                id="comment"
                                className="form__textarea"
                                placeholder="Additional details about your order"
                                rows={4}
                                {...register('comment')}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn--primary ${styles.order_modal__submit_button}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className={styles.order_modal__loading_indicator}>
                  <svg className={styles.order_modal__spinner} xmlns="http://www.w3.org/2000/svg" fill="none"
                       viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
                            ) : 'Submit Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
